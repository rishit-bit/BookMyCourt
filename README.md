# 🏟️ BookMyCourt - Sports Court Booking System

An online platform where you can book sports courts easily. This app has a beautiful 3D login page with amazing visual effects and lets teams book courts for various sports.

## ✨ What This App Does

### 🎮 Cool 3D Features
- **3D Cricket Stadium** that looks like a real stadium at night with bright lights
- **Moving crowd** that looks realistic
- **Real-looking grass** with proper sports field markings
- **Sports equipment** in the background (basketball hoop, football goal, tennis net)
- **Beautiful camera effects** that make everything look more real

### 🌟 Visual Effects
- **Glowing borders** around buttons and elements
- **Moving light beams** that sweep across the screen
- **Floating sports icons** that move in 3D space
- **Particle effects** like dust floating in the air
- **Special effects** that make everything look more polished

### 🎨 Design
- **Dark blue colors** with green glowing effects
- **Bright yellow and neon colors** like a real stadium
- **Modern 3D design** that looks like a sports scoreboard
- **Cool rotating effects** that make it feel like you're entering a stadium
- **Exciting atmosphere** perfect for sports fans

### 🔧 How It's Built
- **React** - Modern web framework (version 18)
- **Three.js** - For creating 3D graphics
- **MongoDB** - Database to store user and booking information
- **Express.js** - Backend server that handles requests
- **Works on all devices** - Mobile, tablet, and desktop

## 🚀 How to Get Started

### What You Need First
- **Node.js** version 16 or higher (download from nodejs.org)
- **MongoDB** database (can be local on your computer or cloud-based)
- **A modern web browser** that supports WebGL (Chrome, Firefox, Edge, Safari)

### Step-by-Step Installation

1. **Download the project**
   ```bash
   git clone <repository-url>
   cd Final_Project
   ```

2. **Install the required packages**
   ```bash
   # First, install packages for the server (backend)
   npm install
   
   # Then, install packages for the client (frontend)
   cd client
   npm install
   cd ..
   ```
   
   **OR** use the shortcut command:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Open the .env file and fill in your details
   # You can use any text editor like Notepad, VS Code, etc.
   ```

4. **Start the application**
   ```bash
   # This starts both server and client together
   npm run dev
   
   # OR start them separately:
   npm run server    # Starts the backend (port 5000)
   npm run client    # Starts the frontend (port 3000)
   ```

   After starting, open your browser and go to: `http://localhost:3000`

## 🌐 Setting Up Environment Variables

Create a file named `.env` in the main project folder with these settings:

```env
# Server Settings
PORT=5000
NODE_ENV=development

# Database Settings (MongoDB)
MONGODB_URI=mongodb://localhost:27017/bookmycourt

# Security Settings (create a random secret key)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a random string of your choice for security!

## 📁 Project Structure Explained

```
Final_Project/
├── server/                    # Backend code (runs on server)
│   ├── models/               # Database table definitions
│   ├── routes/               # API endpoints (how frontend talks to backend)
│   ├── scripts/              # Utility scripts for admin tasks
│   ├── utils/                # Helper functions
│   └── index.js              # Main server file
├── client/                    # Frontend code (what users see)
│   ├── public/               # Images and static files
│   ├── src/
│   │   ├── components/      # All the UI components
│   │   │   ├── 3D/          # 3D visual effects
│   │   │   ├── Dashboard.js # User dashboard
│   │   │   ├── LoginForm.js # Login page
│   │   │   └── ...          # Other components
│   │   ├── contexts/         # Shared state management
│   │   └── App.js           # Main app component
│   └── package.json         # Frontend dependencies
├── package.json              # Backend dependencies
└── README.md                 # This file
```

## 🎯 Main Features Explained

### For Users
- **Create Account** - Sign up with email verification
- **Login** - Secure login with password
- **Browse Courts** - See available courts for different sports
- **Book Courts** - Reserve courts for specific dates and times
- **View Bookings** - See all your past and upcoming bookings
- **Make Payments** - Pay for your bookings online
- **View Dashboard** - See your booking statistics

### For Admins
- **Manage Courts** - Add, edit, or remove courts
- **Manage Users** - View and manage all users
- **Manage Bookings** - View and manage all bookings
- **Send Notifications** - Send messages to all users
- **View Analytics** - See statistics about the platform

## 🔐 Security Features

The app includes several security measures:
- **Password encryption** - Passwords are never stored in plain text
- **Secure tokens** - Uses JWT tokens for authentication
- **Rate limiting** - Prevents too many login attempts
- **Input validation** - Checks all user inputs for safety
- **Protected routes** - Only logged-in users can access certain pages

## 📱 Works on All Devices

The app is designed to work well on:
- **Desktop computers** (Windows, Mac, Linux)
- **Tablets** (iPad, Android tablets)
- **Mobile phones** (iPhone, Android)

The layout automatically adjusts to fit your screen size.

## 🚀 Performance

The app is optimized for:
- **Fast loading** - 3D graphics load efficiently
- **Smooth animations** - Everything runs smoothly
- **Low memory usage** - Works well even on slower devices
- **GPU acceleration** - Uses your graphics card for better performance

## 🧪 Testing the App

To test if everything works:

1. **Test Signup** - Try creating a new account
2. **Test Login** - Try logging in with your account
3. **Test 3D Effects** - Check if the 3D animations work smoothly
4. **Test on Mobile** - Try opening the app on your phone
5. **Test Forms** - Try submitting forms with wrong data to see validation

## 🔧 Development Commands

Here are the commands you can use:

```bash
npm run dev          # Start both server and client together
npm run server       # Start only the backend server
npm run client       # Start only the frontend
npm run build        # Create production build of frontend
npm run install-all  # Install all dependencies (root + client)
```

## 🌟 What's Coming Next

Future features planned:
- **Real-time notifications** - Get instant updates about your bookings
- **More sports** - Add more sports to choose from
- **Payment gateway** - Integrate with payment services
- **Team features** - Create teams and book courts together
- **Mobile app** - Native mobile app for iOS and Android
- **Smart suggestions** - AI recommendations for courts

## 🤝 How to Contribute

Want to help improve the project?

1. Fork the project (create your own copy)
2. Create a new branch for your feature
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📞 Need Help?

If you face any issues:
1. Check if all dependencies are installed
2. Make sure MongoDB is running
3. Check your `.env` file has correct values
4. Look at the console for error messages

## 🙏 Credits

Thanks to these amazing tools and libraries:
- **Three.js** - For 3D graphics
- **React Three Fiber** - For React + Three.js integration
- **MongoDB** - For the database
- **Express.js** - For the backend server
- **Styled Components** - For styling

---

**BookMyCourt** - Where Champions Are Made! 🏆

Book your sports court easily with our modern platform. Join thousands of athletes and sports enthusiasts who are already using BookMyCourt!
