# Free AI API Setup Guide for TurboLearn AI

## Quick Start - Get Your Free API Key in 2 Minutes!

### Option 1: OpenAI (Recommended) - $5 Free Credits

1. Sign Up: Go to [OpenAI Platform](https://platform.openai.com/signup)
   - Use your email/Google account
   - You'll automatically get $5 in free credits!

2. Get API Key: 
   - Visit [API Keys Page](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

3. Use in TurboLearn:
   - Run: `streamlit run turbolearn_ai.py`
   - Paste your key in the sidebar
   - Start generating real AI content from PDFs!

### Option 2: Google Gemini (Most Generous Free Tier)

1. Sign Up: Go to [Google AI Studio](https://aistudio.google.com/)
   - Use your Google account
   - Completely free with generous limits!

2. Get API Key:
   - Click "Get API Key"
   - Create new key
   - Copy the key

3. Use in TurboLearn:
   - Select "Google Gemini (Free)" in dropdown
   - Paste your key
   - Enjoy unlimited PDF processing!

### Option 3: Anthropic Claude - $5 Free Credits

1. Sign Up: [Anthropic Console](https://console.anthropic.com/)
2. Get Credits: New users get $5 free
3. API Key: Generate in the console

## Why You Need an API Key

Without API Key (Demo Mode):
- Shows generic sample content
- Doesn't analyze your actual PDF
- Same questions for every document

With API Key (AI Mode):
- Analyzes YOUR specific PDF content
- Generates relevant questions from YOUR material
- Creates personalized study notes
- Makes flashcards based on YOUR content

## Example Output Difference

### Demo Mode:
```
Q: What is the main concept discussed in this section?
A: The main concept covers fundamental principles...
```

### AI Mode (Your PDF):
```
Q: What are the three types of machine learning mentioned in Chapter 4?
A: Supervised learning, unsupervised learning, and reinforcement learning as described on pages 45-47.
```

## Pro Tips

1. OpenAI: Best for detailed, accurate content
2. Google Gemini: Best for large documents (longer context)
3. Start Free: All options give you free credits to try
4. Monitor Usage: Check your usage in the respective dashboards

## Installation Commands

```bash
# Install required packages
pip install streamlit openai google-generativeai PyMuPDF pandas

# Run the application
streamlit run turbolearn_ai.py
```

## Need Help?

- OpenAI Issues: Check [OpenAI Help](https://help.openai.com/)
- Google Gemini: Visit [Google AI Docs](https://ai.google.dev/)
- Tool Issues: Make sure all dependencies are installed

---

Ready to transform your PDFs into personalized study materials? Get your free API key now!
