#!/usr/bin/env python3
"""
TurboLearn AI - Setup and Installation Script
Run this script to set up the environment and install dependencies
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("All packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing packages: {e}")
        return False
    return True

def create_env_file():
    """Create a sample .env file"""
    env_content = """# TurboLearn AI Environment Variables
# Add your OpenAI API key here (optional - demo mode works without it)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Set custom model preferences
OPENAI_MODEL=gpt-4
MAX_TOKENS=1200
TEMPERATURE=0.3

# App configuration
APP_TITLE=TurboLearn AI
DEBUG=False
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("Created .env file with default configuration")
    else:
        print(".env file already exists")

def run_tests():
    """Run basic functionality tests"""
    print("Running basic tests...")
    try:
        from core_functions import test_pdf_processor, test_ai_generator
        test_pdf_processor()
        test_ai_generator()
        print("All tests passed!")
    except ImportError as e:
        print(f"Could not run tests due to missing dependencies: {e}")
        print("Please install requirements first: pip install -r requirements.txt")

def main():
    print("TurboLearn AI - Setup Script")
    print("=" * 40)
    
    if not install_requirements():
        print("Setup failed during package installation")
        return
    
    create_env_file()
    run_tests()
    
    print("\nSetup completed successfully!")
    print("\nNext steps:")
    print("1. (Optional) Add your OpenAI API key to the .env file")
    print("2. Run the application: streamlit run turbolearn_ai.py")
    print("3. Upload a PDF and generate study materials!")
    print("\nThe app works in demo mode even without an OpenAI API key")

if __name__ == "__main__":
    main()
