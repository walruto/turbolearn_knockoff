#!/usr/bin/env python3
"""Simple API test - minimal version"""

print("Starting simple API test...")

try:
    print("Step 1: Importing library...")
    import google.generativeai as genai
    print("Import successful")
    
    print("Step 2: Configuring API...")
    API_KEY = "AIzaSyDnerggnlpRnYSUE75raLwvCHLIF081R7k"
    genai.configure(api_key=API_KEY)
    print("API configured")
    
    print("Step 3: Creating model...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Model created")
    
    print("Step 4: Testing generation...")
    response = model.generate_content("Say hello and tell me you're working!")
    print("Generation complete")
    
    print("Step 5: Displaying result...")
    print("="*50)
    print("RESPONSE:")
    print(response.text)
    print("="*50)
    print("SUCCESS! API is working!")
    
except ImportError as e:
    print(f"Import error: {e}")
    print("Please install: pip install google-generativeai")
    
except Exception as e:
    print(f"Error: {e}")
    print(f"Error type: {type(e).__name__}")
    
print("Test completed.")
input("Press Enter to exit...")
