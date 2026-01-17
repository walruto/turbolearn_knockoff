# Turbolearn.ai Clone - PDF to Study Materials Generator
# Main application file combining all functionality

import streamlit as st
import fitz  # PyMuPDF
import pandas as pd
import os
from typing import List, Tuple
import re
import time
from io import BytesIO
import base64

# Set your API key here for automatic configuration - use environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

class TurboLearnAI:
    def __init__(self):
        self.openai_client = None
        self.gemini_key = None
        self.api_provider = "demo"  # Default to demo mode
        
    def extract_text_from_pdf(self, pdf_file) -> str:
        """
        Extract text from uploaded PDF file using PyMuPDF
        Args:
            pdf_file: Streamlit uploaded file object
        Returns:
            str: Extracted text from PDF
        """
        try:
            # Read PDF from uploaded file
            pdf_bytes = pdf_file.read()
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            text = ""
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
                text += "\n\n"  # Add spacing between pages
            
            pdf_document.close()
            return text.strip()
            
        except Exception as e:
            st.error(f"Error extracting text from PDF: {str(e)}")
            return ""
    
    def split_text_into_chunks(self, text: str, max_tokens: int = 1000) -> List[str]:
        """
        Split text into chunks for processing by AI model
        Args:
            text: Input text to split
            max_tokens: Maximum tokens per chunk (roughly 4 chars = 1 token)
        Returns:
            List[str]: List of text chunks
        """
        # Rough estimation: 4 characters ≈ 1 token
        max_chars = max_tokens * 4
        
        # Split by paragraphs first
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            # If adding this paragraph exceeds max_chars, start new chunk
            if len(current_chunk) + len(paragraph) > max_chars and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = paragraph
            else:
                current_chunk += "\n\n" + paragraph if current_chunk else paragraph
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def generate_notes(self, text_chunk: str) -> str:
        """
        Generate concise study notes from text chunk using AI
        Args:
            text_chunk: Text to summarize
        Returns:
            str: Generated study notes
        """
        # Use Google Gemini API with your key
        if GOOGLE_API_KEY and len(text_chunk.strip()) > 50:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GOOGLE_API_KEY)
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                You are an expert study assistant. Create comprehensive, well-structured study notes from the given text. 
                
                Format your response with:
                - Clear headers and subheaders
                - Bullet points for key concepts
                - Important definitions highlighted
                - Main ideas summarized
                
                Text to analyze:
                {text_chunk}
                
                Create detailed study notes:
                """
                
                response = model.generate_content(prompt)
                return f"**AI-Generated Study Notes**\n\n{response.text}"
                
            except Exception as e:
                st.error(f"AI Error: {str(e)}")
                return self._get_demo_notes(text_chunk)
        
        return self._get_demo_notes(text_chunk)
    
    def _get_demo_notes(self, text_chunk: str) -> str:
        """Fallback demo notes"""
        return f"""
**Study Notes Summary**

**Key Concepts:**
• Main topic extracted from the text content
• Important definitions and terminology  
• Critical processes or methodologies mentioned
• Relevant examples and case studies

**Important Points:**
• Key fact 1 from the content
• Key fact 2 with supporting details
• Key fact 3 with practical applications

**Summary:**
This section covers the fundamental concepts and principles discussed in the source material, providing a structured overview of the main topics for effective study and review.

*Note: This is demo content. Real AI analysis available with API key.*
        """
    
    def generate_flashcards(self, text_chunk: str) -> List[Tuple[str, str]]:
        """
        Generate flashcards in Q&A format from text chunk
        Args:
            text_chunk: Text to create flashcards from
        Returns:
            List[Tuple[str, str]]: List of (question, answer) pairs
        """
        # Use Google Gemini API with your key
        if GOOGLE_API_KEY and len(text_chunk.strip()) > 50:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GOOGLE_API_KEY)
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                Create 5-8 study flashcards from this text. Focus on key concepts, definitions, and important facts.
                
                Format each flashcard as:
                Q: [Question]
                A: [Answer]
                
                Make questions specific and answers concise but complete.
                
                Text to analyze:
                {text_chunk}
                
                Generate flashcards:
                """
                
                response = model.generate_content(prompt)
                flashcards_text = response.text
                
                # Parse flashcards from AI response
                flashcards = []
                lines = flashcards_text.split('\n')
                current_question = ""
                current_answer = ""
                
                for line in lines:
                    line = line.strip()
                    if line.startswith('Q:'):
                        if current_question and current_answer:
                            flashcards.append((current_question, current_answer))
                        current_question = line[2:].strip()
                        current_answer = ""
                    elif line.startswith('A:'):
                        current_answer = line[2:].strip()
                    elif current_answer and line and not line.startswith('Q:'):
                        current_answer += " " + line
                
                # Add the last flashcard
                if current_question and current_answer:
                    flashcards.append((current_question, current_answer))
                
                return flashcards if flashcards else self._get_demo_flashcards()
                
            except Exception as e:
                st.error(f"AI Flashcard Error: {str(e)}")
                return self._get_demo_flashcards()
        
        return self._get_demo_flashcards()
    
    def _get_demo_flashcards(self) -> List[Tuple[str, str]]:
        """Fallback demo flashcards"""
        return [
            (
                "What is the main concept discussed in this section?",
                "The main concept covers the fundamental principles and key methodologies presented in the source material."
            ),
            (
                "What are the key components or elements mentioned?", 
                "The key components include the primary definitions, important processes, and practical applications discussed in the text."
            ),
            (
                "How can this information be applied practically?",
                "This information can be applied through understanding the core principles and implementing the discussed methodologies in relevant contexts."
            ),
            (
                "What are the most important facts to remember?",
                "The most important facts include the main definitions, critical processes, and key examples that support the overall understanding of the topic."
            )
        ]
    
    def generate_quizzes(self, text_chunk: str) -> List[dict]:
        """
        Generate multiple choice quizzes from text chunk
        Args:
            text_chunk: Text to create quizzes from
        Returns:
            List[dict]: List of quiz questions with options and correct answers
        """
        # Use Google Gemini API with your key
        if GOOGLE_API_KEY and len(text_chunk.strip()) > 50:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GOOGLE_API_KEY)
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                Create 4-6 multiple choice quiz questions from this text. Focus on key concepts, important facts, and main ideas.
                
                Format each question as:
                Question: [Question text]
                A) [Option A]
                B) [Option B]  
                C) [Option C]
                D) [Option D]
                Correct: [A/B/C/D]
                
                Make questions challenging but fair, with plausible wrong answers.
                
                Text to analyze:
                {text_chunk}
                
                Generate quiz questions:
                """
                
                response = model.generate_content(prompt)
                quiz_text = response.text
                
                # Parse quiz questions from AI response
                quizzes = []
                lines = quiz_text.split('\n')
                current_quiz = {}
                
                for line in lines:
                    line = line.strip()
                    if line.startswith('Question:'):
                        if current_quiz:
                            quizzes.append(current_quiz)
                        current_quiz = {'question': line[9:].strip(), 'options': [], 'correct': ''}
                    elif line.startswith(('A)', 'B)', 'C)', 'D)')):
                        if 'options' in current_quiz:
                            current_quiz['options'].append(line)
                    elif line.startswith('Correct:'):
                        current_quiz['correct'] = line[8:].strip()
                
                # Add the last quiz
                if current_quiz and 'question' in current_quiz:
                    quizzes.append(current_quiz)
                
                return quizzes if quizzes else self._get_demo_quizzes()
                
            except Exception as e:
                st.error(f"AI Quiz Error: {str(e)}")
                return self._get_demo_quizzes()
        
        return self._get_demo_quizzes()
    
    def _get_demo_quizzes(self) -> List[dict]:
        """Fallback demo quizzes"""
        return [
            {
                "question": "What is the main concept discussed in this document?",
                "options": [
                    "A) The fundamental principles and methodologies presented",
                    "B) Historical background information only", 
                    "C) Statistical data and charts",
                    "D) Personal opinions and perspectives"
                ],
                "correct": "A"
            },
            {
                "question": "Which of the following best describes the key components mentioned?",
                "options": [
                    "A) Only theoretical concepts",
                    "B) Primary definitions, processes, and applications", 
                    "C) Just practical examples",
                    "D) Background research only"
                ],
                "correct": "B"
            },
            {
                "question": "How can the information from this document be best utilized?",
                "options": [
                    "A) For entertainment purposes only",
                    "B) As historical reference material",
                    "C) Through understanding principles and implementing methodologies", 
                    "D) For creating artwork"
                ],
                "correct": "C"
            }
        ]
    
    def export_to_markdown(self, notes: List[str]) -> str:
        """
        Export notes to Markdown format
        Args:
            notes: List of generated notes
        Returns:
            str: Markdown formatted content
        """
        markdown_content = "# Study Notes - Generated by TurboLearn AI\n\n"
        markdown_content += f"*Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        markdown_content += "---\n\n"
        
        for i, note in enumerate(notes, 1):
            markdown_content += f"## Section {i}\n\n"
            markdown_content += note
            markdown_content += "\n\n---\n\n"
        
        return markdown_content
    
    def export_flashcards_to_csv(self, flashcards: List[Tuple[str, str]]) -> pd.DataFrame:
        """
        Export flashcards to CSV format (Anki-compatible)
        Args:
            flashcards: List of (question, answer) tuples
        Returns:
            pd.DataFrame: DataFrame ready for CSV export
        """
        df = pd.DataFrame(flashcards, columns=['Question', 'Answer'])
        df['Tags'] = 'TurboLearnAI::Generated'
        df['Type'] = 'Basic'
        return df
    
    def export_quizzes_to_csv(self, quizzes: List[dict]) -> pd.DataFrame:
        """
        Export quizzes to CSV format
        Args:
            quizzes: List of quiz dictionaries
        Returns:
            pd.DataFrame: DataFrame ready for CSV export
        """
        quiz_data = []
        for i, quiz in enumerate(quizzes, 1):
            quiz_data.append({
                'Question_Number': i,
                'Question': quiz['question'],
                'Option_A': quiz['options'][0] if len(quiz['options']) > 0 else '',
                'Option_B': quiz['options'][1] if len(quiz['options']) > 1 else '',
                'Option_C': quiz['options'][2] if len(quiz['options']) > 2 else '',
                'Option_D': quiz['options'][3] if len(quiz['options']) > 3 else '',
                'Correct_Answer': quiz['correct'],
                'Tags': 'TurboLearnAI::Quiz'
            })
        return pd.DataFrame(quiz_data)
    
    def create_download_link(self, content: str, filename: str, file_type: str = "text"):
        """
        Create a download link for generated content
        """
        if file_type == "text":
            b64 = base64.b64encode(content.encode()).decode()
            href = f'<a href="data:text/plain;base64,{b64}" download="{filename}">📥 Download {filename}</a>'
        return href

def main():
    # Streamlit UI
    st.set_page_config(
        page_title="TurboLearn AI - PDF Study Tool", 
        page_icon="🧠",
        layout="wide"
    )
    
    # Custom CSS - Modern Cluely-Inspired Design
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    .stApp {
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #ffffff;
    }
    
    .hero-container {
        background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(45, 27, 105, 0.8) 100%);
        backdrop-filter: blur(30px);
        border-radius: 32px;
        padding: 4rem 3rem;
        margin: 2rem auto;
        max-width: 1200px;
        box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.2);
        position: relative;
        overflow: hidden;
    }
    
    .hero-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.6) 50%, transparent 100%);
    }
    
    .main-header {
        text-align: center;
        font-family: 'Space Grotesk', sans-serif;
        background: linear-gradient(135deg, #a855f7 0%, #c084fc 25%, #e879f9 50%, #fbbf24 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: clamp(3rem, 8vw, 5.5rem);
        font-weight: 900;
        margin-bottom: 1.5rem;
        letter-spacing: -0.05em;
        line-height: 0.9;
        position: relative;
    }
    
    .main-header::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(90deg, #a855f7 0%, #c084fc 100%);
        border-radius: 2px;
        opacity: 0.6;
    }
    
    .subtitle {
        text-align: center;
        color: #cbd5e1;
        font-size: clamp(1.1rem, 3vw, 1.5rem);
        font-weight: 400;
        margin-bottom: 4rem;
        opacity: 0.9;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.6;
    }
    
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin: 3rem 0;
    }
    
    @media (max-width: 768px) {
        .content-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
    }
    
    /* Action Section */
    .action-section {
        margin: 3rem 0;
        text-align: center;
    }
    
    /* Download Grid */
    .download-grid {
        margin: 2rem 0;
    }
    
    /* Download Cards */
    .download-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .download-card:hover {
        border-color: rgba(139, 92, 246, 0.6);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
    }
    
    .download-card .download-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
    }
    
    .download-card h3 {
        color: #f8fafc;
        font-family: "Outfit", sans-serif;
        font-weight: 700;
        font-size: 1.3rem;
        margin: 0 0 0.8rem 0;
    }
    
    .download-card p {
        color: #cbd5e1;
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.95rem;
        line-height: 1.5;
        margin: 0;
    }
    
    /* Modern Footer */
    .modern-footer {
        margin-top: 5rem;
        padding: 4rem 2rem 2rem 2rem;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
        border-radius: 24px;
        border: 1px solid rgba(139, 92, 246, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .modern-footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%);
    }
    
    .footer-content {
        text-align: center;
        color: #f8fafc;
    }
    
    .footer-brand h3 {
        color: #f8fafc;
        text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    }
    
    /* Process Flow */
    .process-flow {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2.5rem;
        flex-wrap: wrap;
        margin: 3rem 0;
    }
    
    .process-step {
        text-align: center;
        flex: 0 0 auto;
    }
    
    .process-step .process-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
        transition: all 0.3s ease;
    }
    
    .process-step:hover .process-icon {
        transform: scale(1.1);
        filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.6));
    }
    
    .process-step strong {
        display: block;
        color: #f8fafc;
        font-family: "Outfit", sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
    }
    
    .process-step p {
        color: #cbd5e1;
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.95rem;
        margin: 0;
    }
    
    .process-arrow {
        font-size: 2rem;
        color: #8b5cf6;
        font-weight: bold;
        margin: 0 1rem;
    }
    
    /* Footer Credits */
    .footer-credits {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .footer-credits p {
        color: #94a3b8;
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.95rem;
        margin: 0;
    }
    
    .feature-card {
        background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(45, 27, 105, 0.7) 100%);
        backdrop-filter: blur(20px);
        padding: 2.5rem;
        border-radius: 24px;
        border: 1px solid rgba(139, 92, 246, 0.2);
        box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }
    
    .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
    }
    
    .feature-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 30px 80px rgba(139, 92, 246, 0.25);
        border-color: rgba(168, 85, 247, 0.4);
    }
    
    .feature-card h3 {
        color: #f8fafc;
        font-weight: 700;
        font-size: 1.35rem;
        margin-bottom: 1rem;
        font-family: 'Space Grotesk', sans-serif;
    }
    
    .feature-card p {
        color: #cbd5e1;
        font-weight: 400;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .generate-button {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        border: none;
        padding: 1.5rem 3rem;
        border-radius: 20px;
        font-weight: 700;
        font-size: 1.2rem;
        font-family: 'Space Grotesk', sans-serif;
        cursor: pointer;
        transition: all 0.4s ease;
        box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
        text-transform: none;
        border: 1px solid rgba(168, 85, 247, 0.3);
        margin: 2rem auto;
        display: block;
        min-width: 280px;
    }
    
    .generate-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 25px 60px rgba(139, 92, 246, 0.6);
        background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        scale: 1.05;
    }
    
    .sidebar .stMarkdown {
        background: rgba(15, 15, 35, 0.8);
        border-radius: 20px;
        padding: 2rem;
        margin: 1.5rem 0;
        border: 1px solid rgba(139, 92, 246, 0.2);
        backdrop-filter: blur(15px);
    }
    
    .stProgress > div > div > div > div {
        background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
        border-radius: 12px;
        height: 8px;
    }
    
    .modern-card {
        background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(45, 27, 105, 0.8) 100%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 24px;
        padding: 2.5rem;
        margin: 2rem 0;
        box-shadow: 0 20px 50px rgba(139, 92, 246, 0.15);
        backdrop-filter: blur(20px);
        transition: all 0.3s ease;
        position: relative;
    }
    
    .modern-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.5) 50%, transparent 100%);
    }
    
    .modern-card:hover {
        border-color: rgba(168, 85, 247, 0.5);
        transform: translateY(-5px);
        box-shadow: 0 30px 70px rgba(139, 92, 246, 0.2);
    }
    
    .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 0.025em;
    }
    
    .status-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
    
    .status-warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    }
    
    .status-info {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
    }
    
    .section-header {
        font-family: 'Space Grotesk', sans-serif;
        color: #f8fafc;
        text-align: center;
        margin: 3rem 0;
        font-weight: 800;
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        letter-spacing: -0.025em;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 12px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(15, 15, 35, 0.5);
        border-radius: 8px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border-radius: 8px;
        border: 2px solid rgba(15, 15, 35, 0.5);
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
    }
    
    /* Enhanced tab styling */
    .stTabs [data-baseweb="tab-list"] {
        background: rgba(15, 15, 35, 0.8);
        border-radius: 16px;
        padding: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .stTabs [data-baseweb="tab-list"] button {
        border-radius: 12px;
        padding: 1rem 2rem;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
    }
    
    .stTabs [data-baseweb="tab-list"] button [data-testid="stMarkdownContainer"] p {
        font-size: 1.1rem;
        font-weight: 600;
        color: #cbd5e1;
    }
    
    .stTabs [data-baseweb="tab-list"] button[aria-selected="true"] {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    }
    
    .stTabs [data-baseweb="tab-list"] button[aria-selected="true"] [data-testid="stMarkdownContainer"] p {
        color: #ffffff;
    }
    
    /* Enhanced file uploader */
    .stFileUploader > div > div {
        background: rgba(15, 15, 35, 0.8);
        border: 2px dashed rgba(139, 92, 246, 0.4);
        border-radius: 20px;
        padding: 3rem 2rem;
        transition: all 0.3s ease;
    }
    
    .stFileUploader > div > div:hover {
        border-color: rgba(168, 85, 247, 0.6);
        background: rgba(15, 15, 35, 0.9);
    }
    
    /* Enhanced checkbox styling */
    .stCheckbox > label {
        color: #f8fafc;
        font-weight: 500;
        font-size: 1.1rem;
        font-family: 'Space Grotesk', sans-serif;
    }
    
    /* Enhanced download buttons */
    .stDownloadButton > button {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 16px;
        font-weight: 600;
        font-family: 'Space Grotesk', sans-serif;
        padding: 1rem 2rem;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .stDownloadButton > button:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
    }
    
    /* Enhanced expander styling */
    .stExpander {
        background: rgba(15, 15, 35, 0.8);
        border-radius: 20px;
        border: 1px solid rgba(139, 92, 246, 0.2);
        margin: 1.5rem 0;
        backdrop-filter: blur(15px);
    }
    
    .stExpander summary {
        color: #f8fafc;
        font-weight: 600;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        padding: 1.5rem;
    }
    
    /* Responsive design improvements */
    @media (max-width: 768px) {
        .hero-container {
            padding: 2.5rem 2rem;
            margin: 1rem;
        }
        
        .main-header {
            font-size: 3rem;
        }
        
        .subtitle {
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        
        .feature-card {
            padding: 2rem;
        }
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Modern Hero Section
    st.markdown('<div class="hero-container">', unsafe_allow_html=True)
    st.markdown('<div class="main-header">🧠 TurboLearn AI</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Transform your PDFs into powerful study materials with cutting-edge artificial intelligence technology. Experience the future of learning today.</div>', unsafe_allow_html=True)
    
    # Modern Sidebar Design
    st.sidebar.markdown("""
    <div style='text-align: center; margin-bottom: 3rem;'>
        <h1 style='background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%); 
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
                   font-size: 2.5rem; font-weight: 900; margin-bottom: 0.8rem; letter-spacing: -0.02em;
                   font-family: "Space Grotesk", sans-serif;'>
            🚀 Features
        </h1>
        <p style='color: #cbd5e1; font-size: 1rem; font-weight: 500;'>AI-Powered Study Platform</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.sidebar.markdown("""
    <div class='modern-card'>
        <div style='margin-bottom: 2rem;'>
            <span style='font-size: 2rem; margin-right: 1rem;'>📄</span> 
            <strong style='color: #f8fafc; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>PDF Text Extraction</strong>
            <br><small style='color: #cbd5e1; font-weight: 500; margin-top: 0.5rem; display: block;'>Advanced OCR & intelligent parsing</small>
        </div>
        <div style='margin-bottom: 2rem;'>
            <span style='font-size: 2rem; margin-right: 1rem;'>🤖</span> 
            <strong style='color: #f8fafc; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>AI-Generated Notes</strong>
            <br><small style='color: #cbd5e1; font-weight: 500; margin-top: 0.5rem; display: block;'>Powered by Google Gemini Pro</small>
        </div>
        <div style='margin-bottom: 2rem;'>
            <span style='font-size: 2rem; margin-right: 1rem;'>🃏</span> 
            <strong style='color: #f8fafc; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>Smart Flashcards</strong>
            <br><small style='color: #cbd5e1; font-weight: 500; margin-top: 0.5rem; display: block;'>Intelligent Q&A generation</small>
        </div>
        <div style='margin-bottom: 2rem;'>
            <span style='font-size: 2rem; margin-right: 1rem;'>📝</span> 
            <strong style='color: #f8fafc; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>Export Formats</strong>
            <br><small style='color: #cbd5e1; font-weight: 500; margin-top: 0.5rem; display: block;'>Markdown, TXT, CSV downloads</small>
        </div>
        <div>
            <span style='font-size: 2rem; margin-right: 1rem;'>💾</span> 
            <strong style='color: #f8fafc; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>Instant Downloads</strong>
            <br><small style='color: #cbd5e1; font-weight: 500; margin-top: 0.5rem; display: block;'>One-click file exports</small>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize the app
    app = TurboLearnAI()
    
    # Modern API Configuration Section
    st.sidebar.markdown("""
    <div style='text-align: center; margin: 3rem 0 2rem 0;'>
        <h2 style='background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%); 
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
                   font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em;
                   font-family: "Space Grotesk", sans-serif;'>
            ⚙️ API Settings
        </h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced API status display
    if GOOGLE_API_KEY:
        st.sidebar.markdown("""
        <div class='modern-card' style='text-align: center;'>
            <div class='status-pill status-success'>
                <span style='font-size: 1.2rem; margin-right: 0.8rem;'>✅</span>
                <strong>API Connected</strong>
            </div>
            <h3 style='color: #f8fafc; margin: 1rem 0; font-size: 1.3rem; font-family: "Space Grotesk", sans-serif;'>Google Gemini API Active!</h3>
            <p style='color: #cbd5e1; margin: 0.8rem 0; font-size: 1rem;'>🤖 AI-powered analysis enabled</p>
            <p style='color: #c084fc; margin: 0; font-size: 0.9rem; font-weight: 600;'>Model: Gemini 1.5 Flash</p>
        </div>
        """, unsafe_allow_html=True)
        app.api_provider = "gemini"
        app.gemini_key = GOOGLE_API_KEY
    else:
        st.sidebar.markdown("""
        <div class='modern-card' style='text-align: center;'>
            <div class='status-pill status-warning'>
                <span style='font-size: 1.2rem; margin-right: 0.8rem;'>⚠️</span>
                <strong>Demo Mode</strong>
            </div>
            <h3 style='color: #f8fafc; margin: 1rem 0; font-size: 1.3rem; font-family: "Space Grotesk", sans-serif;'>API Not Connected</h3>
            <p style='color: #cbd5e1; margin: 0; font-size: 1rem;'>Add API key to enable AI features</p>
        </div>
        """, unsafe_allow_html=True)
        app.api_provider = "demo"
    
    # Modern Content Grid Layout
    st.markdown('<div class="content-grid">', unsafe_allow_html=True)
    
    # Upload Section
    st.markdown('''
    <div class="feature-card">
        <h3>📤 Upload Your PDF</h3>
        <p>Drop your document and watch AI transform it into comprehensive study materials with advanced analysis and intelligent parsing.</p>
    </div>
    ''', unsafe_allow_html=True)
    
    uploaded_file = st.file_uploader(
        "Choose a PDF file", 
        type="pdf",
        help="Upload a PDF document to generate study materials"
    )
    
    if uploaded_file:
        st.markdown(f"""
        <div class='modern-card' style='text-align: center; margin-top: 2rem;'>
            <div class='status-pill status-success'>
                <span style='font-size: 1.2rem; margin-right: 0.8rem;'>✅</span>
                <strong>File Uploaded Successfully</strong>
            </div>
            <h3 style='color: #f8fafc; margin: 1rem 0; font-size: 1.2rem; font-family: "Space Grotesk", sans-serif;'>{uploaded_file.name}</h3>
            <p style='color: #cbd5e1; margin: 0; font-size: 1rem;'>📄 Size: {len(uploaded_file.getvalue())/1024:.1f} KB</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Auto-Generate All Features Section
    st.markdown('''
    <div class="feature-card">
        <h3>🎯 AI-Powered Study Tools</h3>
        <p>Upload your PDF and our AI will automatically generate comprehensive study materials including notes, flashcards, and quizzes.</p>
        <div style='display: flex; justify-content: space-around; margin-top: 2rem; flex-wrap: wrap; gap: 1rem;'>
            <div style='text-align: center; opacity: 0.9;'>
                <div style='font-size: 2.5rem; margin-bottom: 0.5rem;'>📚</div>
                <strong style='color: #f8fafc; font-size: 1rem;'>Study Notes</strong>
            </div>
            <div style='text-align: center; opacity: 0.9;'>
                <div style='font-size: 2.5rem; margin-bottom: 0.5rem;'>🃏</div>
                <strong style='color: #f8fafc; font-size: 1rem;'>Flashcards</strong>
            </div>
            <div style='text-align: center; opacity: 0.9;'>
                <div style='font-size: 2.5rem; margin-bottom: 0.5rem;'>❓</div>
                <strong style='color: #f8fafc; font-size: 1rem;'>Quizzes</strong>
            </div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
    
    # Automatically enable all features
    generate_notes = True
    generate_flashcards = True
    generate_quizzes = True
    
    st.markdown('</div>', unsafe_allow_html=True)  # Close content-grid
    
    # Processing section with modern design
    if uploaded_file and (generate_notes or generate_flashcards or generate_quizzes):
        # Action Section for Generate Button
        st.markdown('<div class="action-section">', unsafe_allow_html=True)
        
        if st.button("Generate Study Materials", 
                     type="primary", 
                     use_container_width=True):
            
            # Modern Processing Interface
            progress_placeholder = st.empty()
            status_placeholder = st.empty()
            
            try:
                # Processing Started
                status_placeholder.markdown("""
                <div class='modern-card' style='text-align: center; margin: 2rem 0;'>
                    <div class='status-pill status-processing'>
                        <span style='font-size: 1.3rem; margin-right: 0.8rem;'>⚡</span>
                        <strong>AI Processing Started</strong>
                    </div>
                    <p style='color: #f8fafc; margin: 1.2rem 0; font-size: 1.1rem; font-family: "Space Grotesk", sans-serif;'>
                        Analyzing your document with advanced AI intelligence...
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                # Initialize progress
                progress_bar = progress_placeholder.progress(0)
                
                # Extract text from PDF
                progress_bar.progress(25)
                extracted_text = app.extract_text_from_pdf(uploaded_file)
                
                if not extracted_text:
                    status_placeholder.markdown("""
                    <div class='modern-card' style='text-align: center;'>
                        <div class='status-pill status-error'>
                            <span style='font-size: 1.2rem; margin-right: 0.8rem;'>❌</span>
                            <strong>Extraction Failed</strong>
                        </div>
                        <p style='color: #f8fafc; margin: 1rem 0; font-size: 1rem;'>Could not extract readable text from PDF</p>
                    </div>
                    """, unsafe_allow_html=True)
                    progress_placeholder.empty()
                    return
                
                # Extraction Success
                status_placeholder.markdown(f"""
                <div class='modern-card' style='text-align: center;'>
                    <div class='status-pill status-success'>
                        <span style='font-size: 1.2rem; margin-right: 0.8rem;'>✅</span>
                        <strong>Text Extracted Successfully</strong>
                    </div>
                    <h3 style='color: #f8fafc; margin: 1rem 0; font-size: 1.3rem; font-family: "Space Grotesk", sans-serif;'>
                        {len(extracted_text):,} characters ready for AI processing
                    </h3>
                    <p style='color: #cbd5e1; margin: 0; font-size: 1rem;'>Preparing intelligent analysis...</p>
                </div>
                """, unsafe_allow_html=True)
                
                progress_bar.progress(50)
                
                # Split text into chunks
                text_chunks = app.split_text_into_chunks(extracted_text)
                
                status_placeholder.markdown(f"""
                <div class='modern-card' style='text-align: center;'>
                    <div class='status-pill status-info'>
                        <span style='font-size: 1.2rem; margin-right: 0.8rem;'>📋</span>
                        <strong>Content Processing Ready</strong>
                    </div>
                    <p style='color: #f8fafc; margin: 1rem 0; font-size: 1rem;'>
                        Split into {len(text_chunks)} optimized chunks for advanced AI analysis
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                # Generate materials
                results = {"notes": [], "flashcards": [], "quizzes": []}
                
                progress_bar.progress(70)
                
                for i, chunk in enumerate(text_chunks):
                    chunk_progress = 70 + (20 * (i + 1) / len(text_chunks))
                    progress_bar.progress(int(chunk_progress))
                    
                    status_placeholder.markdown(f"""
                    <div class='modern-card' style='text-align: center;'>
                        <div class='status-pill status-processing'>
                            <span style='font-size: 1.2rem; margin-right: 0.8rem;'>🧠</span>
                            <strong>AI Analysis in Progress</strong>
                        </div>
                        <p style='color: #f8fafc; margin: 1rem 0; font-size: 1rem;'>
                            Processing chunk {i+1} of {len(text_chunks)}...
                        </p>
                        <div style='background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); height: 4px; border-radius: 2px; margin: 1rem auto; width: 80%;'></div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    if generate_notes:
                        notes = app.generate_notes(chunk)
                        results["notes"].append(notes)
                    
                    if generate_flashcards:
                        flashcards = app.generate_flashcards(chunk)
                        results["flashcards"].extend(flashcards)
                    
                    if generate_quizzes:
                        quizzes = app.generate_quizzes(chunk)
                        results["quizzes"].extend(quizzes)
                    
                    time.sleep(0.1)  # Smooth UX delay
                
                progress_bar.progress(100)
                
                # Final Success Message
                status_placeholder.markdown("""
                <div class='modern-card' style='text-align: center; margin: 2rem 0;'>
                    <div class='status-pill status-success'>
                        <span style='font-size: 1.4rem; margin-right: 0.8rem;'>🎉</span>
                        <strong>Generation Complete!</strong>
                    </div>
                    <h2 style='color: #f8fafc; margin: 1.5rem 0; font-size: 1.5rem; font-family: "Outfit", sans-serif; font-weight: 700;'>
                        Your AI-powered study materials are ready!
                    </h2>
                    <p style='color: #cbd5e1; margin: 0; font-size: 1.1rem;'>Scroll down to view and download your personalized content</p>
                </div>
                """, unsafe_allow_html=True)
                
                progress_placeholder.empty()
                
                # Store results
                st.session_state['results'] = results
                st.session_state['uploaded_filename'] = uploaded_file.name
                
            except Exception as e:
                status_placeholder.markdown(f"""
                <div class='modern-card' style='text-align: center;'>
                    <div class='status-pill status-error'>
                        <span style='font-size: 1.2rem; margin-right: 0.8rem;'>⚠️</span>
                        <strong>Processing Error</strong>
                    </div>
                    <p style='color: #f8fafc; margin: 1rem 0; font-size: 1rem;'>Error: {str(e)}</p>
                </div>
                """, unsafe_allow_html=True)
                progress_placeholder.empty()
        
        st.markdown('</div>', unsafe_allow_html=True)  # Close action-section
    
    # Display Results Section
    if 'results' in st.session_state and st.session_state['results']:
        results = st.session_state['results']
        
        # Success Display
        st.markdown("""
        <div class='modern-card' style='text-align: center; margin: 3rem 0; border: 2px solid rgba(139, 92, 246, 0.6);'>
            <div style='font-size: 3.5rem; margin-bottom: 1.5rem;'>🎉</div>
            <h2 style='margin: 0; font-weight: 800; color: #f8fafc; font-size: 2rem; font-family: "Outfit", sans-serif;'>
                Study Materials Generated Successfully!
            </h2>
            <p style='margin: 1.2rem 0 0 0; color: #cbd5e1; font-size: 1.2rem; font-weight: 500;'>
                Your AI-powered study materials are ready to boost your learning
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Results tabs with modern design
        if ('notes' in results and results['notes'] and 
            'flashcards' in results and results['flashcards'] and 
            'quizzes' in results and results['quizzes']):
            tab1, tab2, tab3, tab4 = st.tabs(["Study Notes", "Flashcards", "Quizzes", "Downloads"])
        else:
            tab1, tab2, tab3, tab4 = st.tabs(["Study Notes", "Flashcards", "Quizzes", "Downloads"])
        
        # Study Notes Tab
        if 'notes' in results and results['notes']:
            with tab1:
                st.markdown('''
                <h2 style="color: #8b5cf6; text-align: center; margin-bottom: 3rem; font-weight: 800; font-size: 2.2rem; font-family: 'Outfit', sans-serif;">
                    AI-Generated Study Notes
                </h2>
                ''', unsafe_allow_html=True)
                
                for i, note in enumerate(results["notes"], 1):
                    with st.expander(f"📖 Section {i} - AI Analysis", expanded=i==1):
                        st.markdown(f"""
                        <div class='modern-card' style='border-left: 4px solid #8b5cf6; margin: 2rem 0;'>
                            <div style='color: #f8fafc; font-size: 1rem; line-height: 1.8; font-family: "Space Grotesk", sans-serif;'>
                                {note}
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
        
        # Flashcards Tab
        if 'flashcards' in results and results['flashcards']:
            with tab2:
                st.markdown('''
                <h2 style="color: #8b5cf6; text-align: center; margin-bottom: 3rem; font-weight: 800; font-size: 2.2rem; font-family: 'Outfit', sans-serif;">
                    🃏 AI-Generated Flashcards
                </h2>
                ''', unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class='modern-card' style='text-align: center; border-left: 4px solid #a855f7; margin-bottom: 2rem;'>
                    <div class='status-pill status-info'>
                        <span style='font-size: 1.2rem; margin-right: 0.8rem;'>🃏</span>
                        <strong>Generated {len(results['flashcards'])} Smart Flashcards</strong>
                    </div>
                    <p style='color: #cbd5e1; margin: 1rem 0 0 0; font-size: 1rem;'>Ready for active recall practice</p>
                </div>
                """, unsafe_allow_html=True)
                
                for i, (question, answer) in enumerate(results["flashcards"], 1):
                    with st.expander(f"💳 Flashcard {i}: {question[:50]}...", expanded=False):
                        st.markdown(f"""
                        <div class='modern-card' style='margin: 2rem 0;'>
                            <div style='margin-bottom: 2.5rem;'>
                                <div class='status-pill' style='background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; margin-bottom: 1rem;'>
                                    <span style='margin-right: 0.8rem;'>❓</span><strong>QUESTION</strong>
                                </div>
                                <p style='margin: 0; font-size: 1.2rem; font-weight: 600; color: #f8fafc; line-height: 1.6; font-family: "Space Grotesk", sans-serif;'>{question}</p>
                            </div>
                            <div>
                                <div class='status-pill status-success' style='margin-bottom: 1rem;'>
                                    <span style='margin-right: 0.8rem;'>✅</span><strong>ANSWER</strong>
                                </div>
                                <p style='margin: 0; font-size: 1rem; color: #cbd5e1; line-height: 1.6; font-family: "Space Grotesk", sans-serif;'>{answer}</p>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
        
        # Quizzes Tab
        if 'quizzes' in results and results['quizzes']:
            with tab3:
                st.markdown('''
                <h2 style="color: #8b5cf6; text-align: center; margin-bottom: 3rem; font-weight: 800; font-size: 2.2rem; font-family: 'Outfit', sans-serif;">
                    ❓ AI-Generated Quizzes
                </h2>
                ''', unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class='modern-card' style='text-align: center; border-left: 4px solid #06b6d4; margin-bottom: 2rem;'>
                    <div class='status-pill' style='background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white;'>
                        <span style='font-size: 1.2rem; margin-right: 0.8rem;'>❓</span>
                        <strong>Generated {len(results['quizzes'])} Quiz Questions</strong>
                    </div>
                    <p style='color: #cbd5e1; margin: 1rem 0 0 0; font-size: 1rem;'>Test your knowledge and retention</p>
                </div>
                """, unsafe_allow_html=True)
                
                for i, quiz in enumerate(results["quizzes"], 1):
                    with st.expander(f"🧠 Quiz {i}: {quiz['question'][:50]}...", expanded=False):
                        st.markdown(f"""
                        <div class='modern-card' style='margin: 2rem 0;'>
                            <div style='margin-bottom: 2rem;'>
                                <div class='status-pill' style='background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; margin-bottom: 1.5rem;'>
                                    <span style='margin-right: 0.8rem;'>❓</span><strong>QUESTION {i}</strong>
                                </div>
                                <h3 style='margin: 0 0 2rem 0; font-size: 1.3rem; font-weight: 600; color: #f8fafc; line-height: 1.6; font-family: "Space Grotesk", sans-serif;'>{quiz['question']}</h3>
                                
                                <div style='margin-bottom: 2rem;'>
                                    {''.join([f"<p style='margin: 0.8rem 0; font-size: 1.1rem; color: #cbd5e1; padding: 1rem; background: rgba(15, 15, 35, 0.6); border-radius: 12px; border-left: 4px solid {'#10b981' if option.startswith(quiz['correct'] + ')') else '#64748b'};'><strong>{option}</strong></p>" for option in quiz['options']])}
                                </div>
                                
                                <div class='status-pill status-success' style='margin-top: 1.5rem;'>
                                    <span style='margin-right: 0.8rem;'>✅</span><strong>Correct Answer: {quiz['correct']}</strong>
                                </div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
        
        # Downloads Tab  
        with tab4:
            st.markdown('''
            <h2 style="color: #8b5cf6; text-align: center; margin-bottom: 3rem; font-weight: 800; font-size: 2.2rem; font-family: 'Outfit', sans-serif;">
                💾 Download Your Study Materials
            </h2>
            ''', unsafe_allow_html=True)
            
            # Modern Download Cards
            st.markdown('<div class="download-grid">', unsafe_allow_html=True)
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                if 'notes' in results and results['notes']:
                    st.markdown('''
                    <div class="download-card">
                        <div class="download-icon">📄</div>
                        <h3>Study Notes</h3>
                        <p>Comprehensive markdown format for easy reading and editing</p>
                    </div>
                    ''', unsafe_allow_html=True)
                    
                    markdown_content = app.export_to_markdown(results["notes"])
                    st.download_button(
                        label="📄 Download Notes (MD)",
                        data=markdown_content,
                        file_name=f"study_notes_{st.session_state['uploaded_filename']}.md",
                        mime="text/markdown",
                        use_container_width=True
                    )
            
            with col2:
                if 'notes' in results and results['notes']:
                    st.markdown('''
                    <div class="download-card">
                        <div class="download-icon">📝</div>
                        <h3>Text Format</h3>
                        <p>Simple text file for maximum compatibility</p>
                    </div>
                    ''', unsafe_allow_html=True)
                    
                    txt_content = "\n\n".join(results["notes"])
                    st.download_button(
                        label="📝 Download Notes (TXT)",
                        data=txt_content,
                        file_name=f"study_notes_{st.session_state['uploaded_filename']}.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
            
            with col3:
                if 'flashcards' in results and results['flashcards']:
                    st.markdown('''
                    <div class="download-card">
                        <div class="download-icon">🃏</div>
                        <h3>Flashcards</h3>
                        <p>CSV format for Anki and other apps</p>
                    </div>
                    ''', unsafe_allow_html=True)
                    
                    df = app.export_flashcards_to_csv(results["flashcards"])
                    csv = df.to_csv(index=False)
                    st.download_button(
                        label="🃏 Download Flashcards",
                        data=csv,
                        file_name=f"flashcards_{st.session_state['uploaded_filename']}.csv",
                        mime="text/csv",
                        use_container_width=True
                    )
            
            with col4:
                if 'quizzes' in results and results['quizzes']:
                    st.markdown('''
                    <div class="download-card">
                        <div class="download-icon">❓</div>
                        <h3>Quizzes</h3>
                        <p>Multiple choice questions with answers</p>
                    </div>
                    ''', unsafe_allow_html=True)
                    
                    df_quiz = app.export_quizzes_to_csv(results["quizzes"])
                    csv_quiz = df_quiz.to_csv(index=False)
                    st.download_button(
                        label="❓ Download Quizzes",
                        data=csv_quiz,
                        file_name=f"quizzes_{st.session_state['uploaded_filename']}.csv",
                        mime="text/csv",
                        use_container_width=True
                    )
            
            st.markdown('</div>', unsafe_allow_html=True)  # Close download-grid
            
            # Tips Section
            st.markdown("""
            <div class='modern-card' style='margin-top: 3rem; border-left: 4px solid #06b6d4;'>
                <div class='status-pill' style='background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; margin-bottom: 1rem;'>
                    <span style='margin-right: 0.8rem;'>💡</span><strong>Pro Tips</strong>
                </div>
                <ul style='color: #cbd5e1; font-size: 1rem; line-height: 1.8; margin: 0; padding-left: 1.5rem; font-family: "Space Grotesk", sans-serif;'>
                    <li><strong>Study Notes</strong> in markdown format can be opened in any text editor with rich formatting support</li>
                    <li><strong>Flashcards</strong> in CSV format can be imported directly into Anki, Quizlet, and other study apps</li>
                    <li><strong>Quizzes</strong> provide multiple choice questions perfect for self-testing and exam preparation</li>
                    <li><strong>Text files</strong> are ideal for quick reference, printing, and universal compatibility</li>
                    <li>Use <strong>active recall</strong> with flashcards and quizzes to improve long-term retention</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)
    
    # Close the main container
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Modern Footer
    st.markdown("""
    <div class='modern-footer'>
        <div class='footer-content'>
            <div class='footer-brand'>
                <h3 style='margin: 0 0 1rem 0; font-size: 2rem; font-family: "Outfit", sans-serif; font-weight: 800;'>
                    🧠 TurboLearn AI
                </h3>
                <p style='font-size: 1.3rem; margin: 0 0 2.5rem 0; font-weight: 500; color: #cbd5e1;'>
                    Transform your learning journey with cutting-edge AI technology
                </p>
            </div>
            
            <div class='process-flow'>
                <div class='process-step'>
                    <div class='process-icon'>📚</div>
                    <strong>Upload</strong>
                    <p>PDF Documents</p>
                </div>
                <div class='process-arrow'>→</div>
                <div class='process-step'>
                    <div class='process-icon'>🤖</div>
                    <strong>Generate</strong>
                    <p>AI Analysis</p>
                </div>
                <div class='process-arrow'>→</div>
                <div class='process-step'>
                    <div class='process-icon'>💾</div>
                    <strong>Download</strong>
                    <p>Study Materials</p>
                </div>
                <div class='process-arrow'>→</div>
                <div class='process-step'>
                    <div class='process-icon'>🎯</div>
                    <strong>Master</strong>
                    <p>Your Subject</p>
                </div>
            </div>
            
            <div class='footer-credits'>
                <p>Powered by Google Gemini AI • Built with ❤️ for learners worldwide</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
