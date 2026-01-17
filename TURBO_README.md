# TurboLearn AI - PDF to Study Materials Generator

A powerful Python tool that replicates the core features of Turbolearn.ai, transforming PDF documents into comprehensive study materials using AI.

## Features

### Core Functionality
- PDF Text Extraction - Extract text from any PDF document using PyMuPDF
- AI-Powered Notes - Generate structured study notes using OpenAI GPT-4
- Smart Flashcards - Create Anki-style Q&A flashcards from key concepts
- Multiple Export Formats - Download as Markdown, TXT, CSV, or Anki format
- Beautiful Web Interface - User-friendly Streamlit web application

### Advanced Features
- Intelligent Text Chunking - Split large documents with context preservation
- Batch Processing - Handle multiple PDF sections efficiently
- Instant Downloads - Export study materials in multiple formats
- Customizable Output - Choose between notes, flashcards, or both
- Responsive Design - Works on desktop and mobile devices

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Quick Setup

1. Clone or download the project files
2. Run the setup script:
   ```bash
   python setup.py
   ```
3. Start the application:
   ```bash
   streamlit run turbolearn_ai.py
   ```

### Manual Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables (optional):
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. Run the application:
   ```bash
   streamlit run turbolearn_ai.py
   ```

## Usage

### Web Interface

1. Open your browser to `http://localhost:8501`
2. Upload a PDF document using the file uploader
3. Select features:
   - Generate Study Notes
   - Generate Flashcards
4. Click "Generate Study Materials"
5. Download your results in multiple formats

### Command Line Usage

```python
from core_functions import PDFProcessor, AIGenerator, ExportManager

# Extract text from PDF
processor = PDFProcessor()
text = processor.extract_text_from_pdf("document.pdf")

# Generate study materials
generator = AIGenerator(api_key="your-openai-key")
notes = generator.generate_notes(text)
flashcards = generator.generate_flashcards(text)

# Export results
exporter = ExportManager()
markdown = exporter.export_to_markdown([notes])
csv_data = exporter.export_flashcards_to_csv(flashcards)
```

## 📁 Project Structure

```
turbolearn-ai/
├── turbolearn_ai.py      # Main Streamlit application
├── core_functions.py     # Reusable core functions
├── requirements.txt      # Python dependencies
├── setup.py             # Setup and installation script
├── TURBO_README.md      # This documentation
├── .env.example         # Environment variables template
└── examples/            # Example PDFs and outputs
```

## API Keys Setup

### OpenAI API Key (Recommended)

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to environment:
   ```bash
   # Option 1: Environment variable
   export OPENAI_API_KEY="your-api-key-here"
   
   # Option 2: .env file
   echo "OPENAI_API_KEY=your-api-key-here" > .env
   
   # Option 3: Enter in web interface
   # Use the sidebar API key input field
   ```

### Demo Mode

The application works without an API key in demo mode, providing:
- PDF text extraction
- Text chunking and processing
- Sample study notes and flashcards
- Full export functionality

## Export Formats

### Study Notes
- Markdown (.md) - Formatted text with headers and bullet points
- Plain Text (.txt) - Clean text format for any application

### Flashcards
- CSV (.csv) - Spreadsheet format with Question/Answer columns
- Anki Format - Direct import into Anki flashcard software

## Core Functions

### PDFProcessor Class
```python
# Extract text from PDF
text = PDFProcessor.extract_text_from_pdf("document.pdf")

# Clean and preprocess text
clean_text = PDFProcessor.clean_text(text)
```

### TextChunker Class
```python
# Split text into processable chunks
chunks = TextChunker.split_text_into_chunks(text, max_tokens=1000)
```

### AIGenerator Class
```python
# Generate study materials
generator = AIGenerator(api_key="your-key")
notes = generator.generate_notes(text_chunk)
flashcards = generator.generate_flashcards(text_chunk, num_cards=5)
```

### ExportManager Class
```python
# Export in different formats
markdown = ExportManager.export_to_markdown(notes)
csv_data = ExportManager.export_flashcards_to_csv(flashcards)
```

## Quick Start Commands

```bash
# Install everything
python setup.py

# Run the app
streamlit run turbolearn_ai.py

# Test core functions
python core_functions.py
```

Happy Learning!
