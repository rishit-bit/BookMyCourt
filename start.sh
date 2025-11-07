#!/bin/bash

echo ""
echo "========================================"
echo "    BookMyCourt - Sports Booking Platform"
echo "========================================"
echo ""
echo "Starting BookMyCourt application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    echo "Please install npm or reinstall Node.js"
    echo ""
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "Checking MongoDB connection..."
echo "Note: Make sure MongoDB is running on localhost:27017"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install server dependencies!"
        exit 1
    fi
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install client dependencies!"
        exit 1
    fi
fi

echo ""
echo "Dependencies installed successfully!"
echo ""
echo "Starting BookMyCourt in development mode..."
echo ""
echo "The application will open in your browser at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev

echo ""
echo "BookMyCourt has been stopped."


