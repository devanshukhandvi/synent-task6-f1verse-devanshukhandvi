# 🏎️ F1VERSE | The Ultimate Formula 1 Digital Cockpit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

F1VERSE is a state-of-the-art interactive digital simulator and racing dashboard designed for Formula 1 enthusiasts and virtual drivers. It features a complete 3D mechanical laboratory, driver academy portals, real-time audio dynamics, telemetry tracking, and customizable team interfaces.

The project contains two options:
1. **F1VERSE Vanilla (Root)**: A lightweight, self-contained single-page vanilla implementation.
2. **F1VERSE Pro (Full-Stack)**: A modern React.js + TypeScript frontend powered by an Express/Node.js API server and MongoDB database.

---

## 🌟 Key Features

### 🏎️ 3D Development Lab & Garage (WebGL/Three.js)
* **Showroom Viewer**: Volumetric 3D F1 chassis rendering with realistic PBR textures, scanning lasers, and environmental fog.
* **Chassis Modes**: Switch between PBR Real, Neon Blue Hologram, Real-time Aerodynamic Wind Tunnel airflow, Exploded chassis layout (with hoverable component descriptions), and X-Ray internals.
* **Comparison Chamber**: Directly side-by-side analyze horsepower, aerodynamics, and top speed metrics between team cars (Red Bull, Ferrari, Mercedes, McLaren).
* **Morphing Era Timeline**: Explore the aerodynamic progression of Formula 1 rules, morphing designs between 1950, 1970, 1990, 2010, and 2026.

### 📊 Real-Time Telemetry & HUD Navigation
* **Ignition Sequence**: Immersive intro cinematic with engine start buttons, RPM counter, telemetry engine standby states, and five-light start sequences.
* **Dynamic Audio Engine**: Custom sound profiles (Aggressive V10, Stealth Electric, Cinematic V10) with reactive volume sliders utilizing the Web Audio API.
* **Team Themes**: Change the visual layout and design language in real-time by selecting Ferrari Passion, Mercedes Precision, McLaren Speed, or Red Bull Aggression.
* **Live Race Countdown**: Active GP countdown tracking the next round's schedule.

### 🎓 Driver Academy & Backend Operations
* **Driver Careers**: Unlock strategist certifications and driver licenses.
* **Sponsor Contracts**: Gamified contract signing animations for brand partnerships.
* **Payment Gateways**: Fully simulated billing portals integrating Razorpay payment workflows.
* **Community Grid Feed**: Social system allowing users to transmit comms, radio logs, and live reactions.

---

## 🛠️ Technology Stack

### Vanilla App (Root)
* **Structure & UI**: HTML5, Vanilla JavaScript, CSS3
* **Styling**: Tailwind CSS (CDN Integration)
* **3D Rendering**: Three.js, Three.js OrbitControls
* **Icons**: Lucide Icons, FontAwesome

### Full-Stack App
#### Client (Vite React App)
* **Framework**: React.js 18 with TypeScript
* **3D Engines**: Three.js, `@react-three/fiber`, `@react-three/drei`
* **Animations**: GSAP (GreenSock), Framer Motion
* **Charts**: Recharts
* **State Management**: React Query (TanStack Query)
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer

#### Server (Express REST API)
* **Runtime**: Node.js with TypeScript (`ts-node-dev`)
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Tokens (JWT) & Bcryptjs password hashing
* **Payment Gateway**: Razorpay Node SDK
* **Notifications**: Nodemailer email dispatchers

---

## 📁 Repository Structure

```text
├── client/                 # React.js Vite Frontend (TypeScript)
│   ├── src/                # Component & Page files
│   └── package.json        # Frontend configuration and dependencies
├── server/                 # Express Node.js Backend (TypeScript)
│   ├── src/                # API controllers, models, and servers
│   └── package.json        # Backend configuration and dependencies
├── index.html              # Standalone Vanilla Frontend Entrypoint
├── app.js                  # Standalone Vanilla Engine JavaScript
├── styles.css              # Custom Vanilla HUD Styling
└── .gitignore              # Dependency & secrets protection
```

---

## 🚀 Getting Started

### 1. Launching Vanilla F1VERSE (Root)
To run the lightweight vanilla interface instantly, you don't need compilation or installation:
1. Open the [index.html](file:///c:/Users/Admin/OneDrive/Desktop/anti1/f1/index.html) file directly in your web browser.
2. Or run it using a local server extension (e.g., VS Code Live Server).

### 2. Deploying F1VERSE Pro (Full-Stack React + Node)

#### Prerequisites
* Node.js (v18+)
* MongoDB database instance active

#### Setting Up the Server Backend
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` folder containing the following configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_token
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_nodemailer_email
   EMAIL_PASS=your_nodemailer_password
   ```
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```

#### Setting Up the Client Frontend
1. Open another terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (typically `http://localhost:5173`) in your browser.

---

## 🛡️ License
This project is licensed under the MIT License. Feel free to fork, customize, and build upon the telemetry lab.
