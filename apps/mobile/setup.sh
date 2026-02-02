#!/bin/bash

# Neurashop Mobile - Quick Setup Script

echo "🚀 Setting up Neurashop Mobile Flutter App..."

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    echo "Visit: https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo "✅ Flutter found: $(flutter --version)"

# Navigate to mobile directory
cd "$(dirname "$0")"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your actual backend service URLs"
fi

# Get Flutter version
flutter --version

# Get dependencies
echo "📦 Installing dependencies..."
flutter pub get

# Generate JSON serialization code
echo "🔨 Generating JSON serialization code..."
dart run build_runner build

# Format code
echo "🎨 Formatting code..."
dart format lib/

# Analyze code
echo "🔍 Analyzing code..."
dart analyze lib/

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your backend service URLs"
echo "2. Run: flutter run"
echo ""
echo "For more information, see README.md"
