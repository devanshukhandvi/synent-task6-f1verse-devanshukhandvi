import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay client (Test Mode sandbox credentials)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mockSecret123',
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/f1verse';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to telemetry database: MongoDB'))
  .catch(err => console.error('MongoDB calibration failure:', err));

// Mongoose Models Setup
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  modules: [{
    name: String,
    lessons: [{ title: String, content: String, videoUrl: String }]
  }]
});

const Course = mongoose.model('Course', courseSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  xp: { type: Number, default: 100 },
  coins: { type: Number, default: 1000 },
  rank: { type: String, default: 'Rookie' },
  enrolledCourses: [{ courseId: String, progress: Number }],
  purchasedFrames: [String],
  activeDecals: [String]
});

const User = mongoose.model('User', userSchema);

// JWT Middleware helper
interface AuthRequest extends Request {
  user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Missing authentic token payload' });

  jwt.verify(token, process.env.JWT_SECRET || 'F1_SECRET_KEY', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token de-calibration failure' });
    req.user = user;
    next();
  });
};

// --- API ENDPOINTS ---

// 1. JWT Authentication
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All telemetry profile keys required (username, email, password)' });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Callsign or email registration conflict' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: username.toLowerCase() === 'admin' ? 'admin' : 'student',
      rank: username.toLowerCase() === 'admin' ? 'Legend' : 'Rookie'
    });
    await newUser.save();
    
    const token = jwt.sign({ username: newUser.username, role: newUser.role }, process.env.JWT_SECRET || 'F1_SECRET_KEY', { expiresIn: '24h' });
    res.status(201).json({
      message: 'Driver profile registered successfully',
      token,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        xp: newUser.xp,
        coins: newUser.coins,
        rank: newUser.rank,
        enrolledCourses: newUser.enrolledCourses,
        purchasedFrames: newUser.purchasedFrames,
        activeDecals: newUser.activeDecals
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Auth database registration failure' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Callsign signature and password parameters required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Driver profile not registered' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication passkey mismatch' });
    }
    
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET || 'F1_SECRET_KEY', { expiresIn: '24h' });
    res.json({
      message: 'JWT verification completed successfully',
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        coins: user.coins,
        rank: user.rank,
        enrolledCourses: user.enrolledCourses,
        purchasedFrames: user.purchasedFrames,
        activeDecals: user.activeDecals
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Auth database validation failure' });
  }
});

// 2. Razorpay Order Creation
app.post('/api/payments/order', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { courseId, price } = req.body;
  try {
    const options = {
      amount: Math.round(price * 100), // convert dollars to cents/paise
      currency: 'USD',
      receipt: `receipt_${courseId}_${Date.now()}`
    };
    
    // Create transaction order
    const order = await razorpayInstance.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (e) {
    res.status(500).json({ message: 'Razorpay order creation failure' });
  }
});

// 3. Admin Course CRUD
app.get('/api/courses', async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (e) {
    res.status(500).json({ message: 'Failed to retrieve telemetry courses' });
  }
});

app.post('/api/courses', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin permissions required' });
  
  const { title, category, price, desc, modules } = req.body;
  try {
    const newCourse = new Course({ title, category, price, desc, modules });
    await newCourse.save();
    res.status(201).json({ message: 'Telemetry course created', course: newCourse });
  } catch (e) {
    res.status(500).json({ message: 'Failed to write to database' });
  }
});

app.delete('/api/courses/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin permissions required' });
  
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Telemetry course deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete course entry' });
  }
});

app.listen(PORT, () => {
  console.log(`F1VERSE operational on port: ${PORT}`);
});
