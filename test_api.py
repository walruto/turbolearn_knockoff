#!/usr/bin/env python3
"""Quick test of Google Gemini API with your key"""

import os
import sys

# Check if the library is installed
try:
    import google.generativeai as genai
    print("google-generativeai library is installed")
except ImportError:
    print("google-generativeai library not found")
    print("Installing it now...")
    os.system("pip install google-generativeai")
    try:
        import google.generativeai as genai
        print("Successfully installed and imported google-generativeai")
    except ImportError:
        print("Failed to install google-generativeai")
        print("Please run: pip install google-generativeai")
        sys.exit(1)

# Your API key - load from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

def test_api():
    """Test the API connection and generation"""
    print("Testing Google Gemini API...")
    print(f"Using API key: {GOOGLE_API_KEY[:10]}...")
    
    try:
        print("Configuring API...")
        genai.configure(api_key=GOOGLE_API_KEY)
        
        print("Checking available models...")
        try:
            models = genai.list_models()
            model_names = []
            for model in models:
                if 'generateContent' in model.supported_generation_methods:
                    model_names.append(model.name)
            print(f"Found {len(model_names)} available models")
            if model_names:
                print(f"First available model: {model_names[0]}")
        except Exception as model_error:
            print(f"Could not list models: {model_error}")
            model_names = ['gemini-1.5-flash', 'gemini-1.0-pro', 'models/gemini-pro']
        
        model = None
        model_attempts = ['gemini-1.5-flash', 'gemini-1.0-pro', 'models/gemini-pro']
        
        for model_name in model_attempts:
            try:
                print(f"Trying model: {model_name}")
                model = genai.GenerativeModel(model_name)
                print(f"Successfully created model: {model_name}")
                break
            except Exception as e:
                print(f"Failed to create model {model_name}: {e}")
                continue
        
        if not model:
            raise Exception("Could not create any model")
        
        test_text = """
        Machine learning is a subset of artificial intelligence that focuses on 
        algorithms that can learn from data without being explicitly programmed.
        The three main types are supervised learning, unsupervised learning, and 
        reinforcement learning.
        """
        
        print("Sample text provided")
        print("Generating AI response...")
        
        prompt = f"""
        Create 3 study flashcards from this text. Format as:
        Q: [Question]
        A: [Answer]
        
        Text: {test_text}
        """
        
        response = model.generate_content(prompt)
        
        if response.text:
            print("\nAPI Response:")
            print("=" * 50)
            print(response.text)
            print("=" * 50)
            print("\nSUCCESS! Your API key works perfectly!")
            print("Now you can upload PDFs and get real AI-generated questions!")
        else:
            print("API responded but with empty content")
            if hasattr(response, 'candidates') and response.candidates:
                print(f"Response info: {response.candidates[0].finish_reason}")
        
    except Exception as e:
        print(f"Error: {e}")
        print("Possible solutions:")
        print("   1. Check your API key is correct")
        print("   2. Make sure you have internet connection")
        print("   3. Verify your Google AI Studio quota")
        print("   4. Try running: pip install --upgrade google-generativeai")
        
        print(f"\nDebug info:")
        print(f"   Python version: {sys.version}")
        print(f"   API key length: {len(GOOGLE_API_KEY)}")
        print(f"   Error type: {type(e).__name__}")
        print(f"   Error details: {str(e)}")

if __name__ == "__main__":
    os.chdir(r"c:\Users\walid\Downloads\drive-download-20250307T051215Z-001\codez\turbo learn")
    test_api()

os.system("pip install streamlit PyMuPDF pandas google-generativeai")
os.system("streamlit run turbolearn_ai.py")
os.system("npm run dev")
