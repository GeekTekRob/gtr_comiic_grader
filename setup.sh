#!/bin/bash

# GTR Comic Grader - macOS/Linux Setup
# Simple setup script for Unix-like systems

echo ""
echo "=========================================="
echo "  GTR Comic Grader - Setup"
echo "  Getting you ready to grade comics!"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please download Node.js from:"
    echo "  https://nodejs.org"
    echo ""
    echo "After installing Node.js, run this script again."
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo ""

# Launch setup wizard (handles installation)
echo "Launching setup wizard..."
node setup.js
if [ $? -ne 0 ]; then
    echo "ERROR: Setup failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Next: Run the setup wizard"
echo "  npm run setup"
echo ""
echo "Then start the app:"
echo "  npm run dev"
echo ""
