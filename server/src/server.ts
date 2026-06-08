import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';

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
  try {
    // Generate simulated token
    const token = jwt.sign({ username, role: 'student' }, process.env.JWT_SECRET || 'F1_SECRET_KEY', { expiresIn: '24h' });
    res.status(201).json({
      message: 'Driver profile registered successfully',
      token,
      user: { username, email, role: 'student', xp: 100, coins: 1000 }
    });
  } catch (e) {
    res.status(500).json({ message: 'Auth database error' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username } = req.body;
  const role = username.toLowerCase() === 'admin' ? 'admin' : 'student';
  const token = jwt.sign({ username, role }, process.env.JWT_SECRET || 'F1_SECRET_KEY', { expiresIn: '24h' });
  
  res.json({
    message: 'JWT verification completed successfully',
    token,
    user: { username, role, xp: role === 'admin' ? 9999 : 150 }
  });
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
