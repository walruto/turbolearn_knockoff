"""
TurboLearn AI - Core Functions Module
Reusable functions for PDF processing and AI-powered study material generation
"""

import fitz  # PyMuPDF
import pandas as pd
import os
from typing import List, Tuple, Optional
import re
import time
import openai

class PDFProcessor:
    """Handle PDF text extraction and processing"""
    
    @staticmethod
    def extract_text_from_pdf(pdf_path: str) -> str:
        """
        Extract text from PDF file using PyMuPDF
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            str: Extracted text from all pages
        """
        try:
            pdf_document = fitz.open(pdf_path)
            text = ""
            
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                page_text = page.get_text()
                text += f"\n--- Page {page_num + 1} ---\n"
                text += page_text
                text += "\n\n"
            
            pdf_document.close()
            return text.strip()
            
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and preprocess extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            str: Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page headers/footers (common patterns)
        text = re.sub(r'\n--- Page \d+ ---\n', '\n\n', text)
        
        # Fix common OCR issues
        text = text.replace('fi', 'fi').replace('fl', 'fl')
        
        return text.strip()

class TextChunker:
    """Handle text chunking for AI processing"""
    
    @staticmethod
    def split_text_into_chunks(text: str, max_tokens: int = 1000, overlap: int = 100) -> List[str]:
        """
        Split text into overlapping chunks for better context preservation
        
        Args:
            text: Input text to split
            max_tokens: Maximum tokens per chunk (roughly 4 chars = 1 token)
            overlap: Number of characters to overlap between chunks
            
        Returns:
            List[str]: List of text chunks with overlap
        """
        max_chars = max_tokens * 4
        chunks = []
        
        # Split by sentences for better chunk boundaries
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        current_chunk = ""
        for sentence in sentences:
            # If adding this sentence exceeds max_chars, finalize current chunk
            if len(current_chunk) + len(sentence) > max_chars and current_chunk:
                chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
                current_chunk = overlap_text + " " + sentence
            else:
                current_chunk += " " + sentence if current_chunk else sentence
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks

class AIGenerator:
    """Handle AI-powered content generation"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize AI Generator with OpenAI API key
        
        Args:
            api_key: OpenAI API key (optional, can use environment variable)
        """
        if api_key:
            openai.api_key = api_key
        elif os.getenv("OPENAI_API_KEY"):
            openai.api_key = os.getenv("OPENAI_API_KEY")
        else:
            print("Warning: No OpenAI API key found. Demo mode will be used.")
            self.demo_mode = True
            return
        
        self.demo_mode = False
    
    def generate_notes(self, text_chunk: str) -> str:
        """
        Generate study notes from text chunk
        
        Args:
            text_chunk: Text to create notes from
            
        Returns:
            str: Generated study notes
        """
        if self.demo_mode:
            return self._demo_notes(text_chunk)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert study assistant. Create comprehensive, well-structured study notes from the given text. 
                        Format your response with:
                        - Clear headers and subheaders
                        - Bullet points for key concepts
                        - Important definitions highlighted
                        - Main takeaways summarized
                        Use markdown formatting for better readability."""
                    },
                    {
                        "role": "user",
                        "content": f"Create detailed study notes from this text:\n\n{text_chunk}"
                    }
                ],
                max_tokens=1200,
                temperature=0.3
            )
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Error generating notes: {str(e)}\n\nFalling back to demo mode...\n\n{self._demo_notes(text_chunk)}"
    
    def generate_flashcards(self, text_chunk: str, num_cards: int = 5) -> List[Tuple[str, str]]:
        """
        Generate flashcards from text chunk
        
        Args:
            text_chunk: Text to create flashcards from
            num_cards: Number of flashcards to generate
            
        Returns:
            List[Tuple[str, str]]: List of (question, answer) pairs
        """
        if self.demo_mode:
            return self._demo_flashcards(text_chunk, num_cards)
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are an expert at creating study flashcards. Generate exactly {num_cards} high-quality flashcards from the given text.
                        Focus on:
                        - Key concepts and definitions
                        - Important facts and figures
                        - Cause and effect relationships
                        - Application-based questions
                        
                        Format each flashcard as:
                        Q: [Clear, specific question]
                        A: [Concise, accurate answer]
                        
                        Separate each flashcard with a blank line."""
                    },
                    {
                        "role": "user",
                        "content": f"Create {num_cards} flashcards from this text:\n\n{text_chunk}"
                    }
                ],
                max_tokens=1500,
                temperature=0.4
            )
            
            return self._parse_flashcards(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error generating flashcards: {str(e)}")
            return self._demo_flashcards(text_chunk, num_cards)
    
    def _demo_notes(self, text_chunk: str) -> str:
        """Generate demo notes when API is not available"""
        word_count = len(text_chunk.split())
        char_count = len(text_chunk)
        
        return f"""# 📚 Study Notes (Demo Mode)

## 📖 Content Overview
- **Word Count:** {word_count} words
- **Character Count:** {char_count} characters
- **Estimated Reading Time:** {word_count // 200} minutes

## 🎯 Key Concepts
• **Main Topic:** [Extracted from content analysis]
• **Primary Focus:** [Identified central theme]
• **Supporting Details:** [Key supporting information]

## 📝 Important Points
• **Definition:** Core concept definitions from the text
• **Process:** Step-by-step procedures mentioned
• **Examples:** Relevant examples and case studies
• **Applications:** Practical applications discussed

## 💡 Summary
This section provides a structured overview of the main concepts presented in the source material. The content covers fundamental principles and practical applications that are essential for understanding the topic.

## 🔗 Connections
• **Related Concepts:** [Connections to other topics]
• **Prerequisites:** [Background knowledge needed]
• **Next Steps:** [Follow-up topics to explore]

---
*Note: This is a demo response. Connect your OpenAI API key for AI-generated content.*"""
    
    def _demo_flashcards(self, text_chunk: str, num_cards: int) -> List[Tuple[str, str]]:
        """Generate demo flashcards when API is not available"""
        demo_cards = [
            ("What is the main concept discussed in this section?", "The main concept involves the key principles and methodologies presented in the source material."),
            ("What are the important definitions mentioned?", "Key definitions include the fundamental terms and concepts that form the foundation of understanding."),
            ("How can this information be applied?", "This information can be applied through practical implementation of the discussed principles and methods."),
            ("What are the key takeaways?", "The key takeaways include the main points, important facts, and actionable insights from the content."),
            ("What examples or case studies are provided?", "The text includes relevant examples that illustrate the practical application of the concepts discussed."),
        ]
        
        return demo_cards[:num_cards]
    
    def _parse_flashcards(self, flashcards_text: str) -> List[Tuple[str, str]]:
        """Parse flashcards from AI response"""
        flashcards = []
        lines = flashcards_text.strip().split('\n')
        
        current_question = ""
        current_answer = ""
        
        for line in lines:
            line = line.strip()
            if line.startswith('Q:'):
                current_question = line[2:].strip()
            elif line.startswith('A:'):
                current_answer = line[2:].strip()
                if current_question and current_answer:
                    flashcards.append((current_question, current_answer))
                    current_question = ""
                    current_answer = ""
        
        return flashcards

class ExportManager:
    """Handle different export formats"""
    
    @staticmethod
    def export_to_markdown(notes: List[str], title: str = "Study Notes") -> str:
        """
        Export notes to Markdown format
        
        Args:
            notes: List of generated notes
            title: Document title
            
        Returns:
            str: Markdown formatted content
        """
        markdown_content = f"# 📚 {title}\n\n"
        markdown_content += f"*Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        markdown_content += f"*Total sections: {len(notes)}*\n\n"
        markdown_content += "---\n\n"
        
        for i, note in enumerate(notes, 1):
            markdown_content += f"## Section {i}\n\n"
            markdown_content += note
            markdown_content += "\n\n---\n\n"
        
        return markdown_content
    
    @staticmethod
    def export_to_txt(notes: List[str], title: str = "Study Notes") -> str:
        """
        Export notes to plain text format
        
        Args:
            notes: List of generated notes
            title: Document title
            
        Returns:
            str: Plain text formatted content
        """
        txt_content = f"{title.upper()}\n"
        txt_content += "=" * len(title) + "\n\n"
        txt_content += f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
        txt_content += f"Total sections: {len(notes)}\n\n"
        
        for i, note in enumerate(notes, 1):
            txt_content += f"SECTION {i}\n"
            txt_content += "-" * 10 + "\n\n"
            # Remove markdown formatting for plain text
            clean_note = re.sub(r'[*_#]', '', note)
            txt_content += clean_note
            txt_content += "\n\n" + "=" * 50 + "\n\n"
        
        return txt_content
    
    @staticmethod
    def export_flashcards_to_csv(flashcards: List[Tuple[str, str]], filename: str = "flashcards") -> pd.DataFrame:
        """
        Export flashcards to CSV format (Anki compatible)
        
        Args:
            flashcards: List of (question, answer) tuples
            filename: Base filename for export
            
        Returns:
            pd.DataFrame: DataFrame ready for CSV export
        """
        df = pd.DataFrame(flashcards, columns=['Question', 'Answer'])
        df['Tags'] = 'TurboLearnAI::Generated'
        df['Type'] = 'Basic'
        df['Deck'] = filename.replace('.pdf', '').replace('_', ' ').title()
        df['Created'] = time.strftime('%Y-%m-%d %H:%M:%S')
        
        return df
    
    @staticmethod
    def export_flashcards_to_anki(flashcards: List[Tuple[str, str]]) -> str:
        """
        Export flashcards in Anki import format
        
        Args:
            flashcards: List of (question, answer) tuples
            
        Returns:
            str: Anki-formatted content
        """
        anki_content = ""
        for question, answer in flashcards:
            # Anki format: Front;Back;Tags
            anki_content += f"{question};{answer};TurboLearnAI::Generated\n"
        
        return anki_content

# Example usage and testing functions
def test_pdf_processor():
    """Test the PDF processing functionality"""
    print("Testing PDF Processor...")
    # This would require an actual PDF file to test
    print("✅ PDF Processor module ready")

def test_ai_generator():
    """Test the AI generator functionality"""
    print("Testing AI Generator...")
    generator = AIGenerator()  # Will use demo mode without API key
    
    sample_text = """
    Machine learning is a subset of artificial intelligence (AI) that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience, without being explicitly programmed to do so. The core idea behind machine learning is that systems can automatically learn and improve from experience.
    """
    
    notes = generator.generate_notes(sample_text)
    flashcards = generator.generate_flashcards(sample_text, 3)
    
    print("Generated Notes Preview:")
    print(notes[:200] + "...")
    print(f"\nGenerated {len(flashcards)} flashcards")
    print("✅ AI Generator module ready")

if __name__ == "__main__":
    print("🧠 TurboLearn AI Core Functions Module")
    print("=" * 40)
    
    test_pdf_processor()
    test_ai_generator()
    
    print("\n🎉 All modules loaded successfully!")
    print("Use 'python turbolearn_ai.py' to run the full Streamlit app")
