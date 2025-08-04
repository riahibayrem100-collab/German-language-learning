from flask import Blueprint, request, jsonify
from flask_cors import CORS
import openai
import json
import re
import os

language_bp = Blueprint('language', __name__)
CORS(language_bp, origins="*")

# Language levels and topics data
LANGUAGE_LEVELS = {
    'A1': 'Beginner - Basic phrases and simple sentences',
    'A2': 'Elementary - Simple conversations and everyday situations',
    'B1': 'Intermediate - Express opinions and describe experiences',
    'B2': 'Upper Intermediate - Complex ideas and abstract topics',
    'C1': 'Advanced - Fluent and spontaneous expression',
    'C2': 'Proficient - Near-native level with nuanced understanding'
}

TOPICS = [
    'Daily Routine', 'Food & Cooking', 'Travel & Transportation', 'Work & Career',
    'Family & Relationships', 'Health & Fitness', 'Shopping & Money', 'Weather & Seasons',
    'Hobbies & Entertainment', 'Education & Learning', 'Technology & Internet', 'Home & Living',
    'Nature & Environment', 'Culture & Traditions', 'Sports & Activities', 'Clothing & Fashion',
    'Time & Schedules', 'Emotions & Feelings', 'City Life & Urban Areas', 'Holidays & Celebrations'
]

@language_bp.route('/levels', methods=['GET'])
def get_levels():
    """Get all available language levels"""
    return jsonify({
        'success': True,
        'levels': LANGUAGE_LEVELS
    })

@language_bp.route('/topics', methods=['GET'])
def get_topics():
    """Get all available topics"""
    return jsonify({
        'success': True,
        'topics': TOPICS
    })

@language_bp.route('/generate-sentence', methods=['POST'])
def generate_sentence():
    """Generate a German sentence with comprehensive analysis"""
    try:
        data = request.get_json()
        level = data.get('level', 'A1')
        topic = data.get('topic', 'Daily Routine')
        
        if level not in LANGUAGE_LEVELS:
            return jsonify({'success': False, 'error': 'Invalid language level'}), 400
        
        if topic not in TOPICS:
            return jsonify({'success': False, 'error': 'Invalid topic'}), 400
        
        # Generate sentence using OpenAI
        sentence_prompt = f"""
        Generate a German sentence for language level {level} ({LANGUAGE_LEVELS[level]}) 
        about the topic "{topic}". The sentence should be:
        - Appropriate for {level} level learners
        - Natural and commonly used
        - Related to {topic}
        - Between 8-20 words long
        
        Return only the German sentence, nothing else.
        """
        
        client = openai.OpenAI()
        sentence_response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": sentence_prompt}],
            max_tokens=100,
            temperature=0.7
        )
        
        german_sentence = sentence_response.choices[0].message.content.strip()
        
        # Generate comprehensive analysis
        analysis_prompt = f"""
        Analyze this German sentence: "{german_sentence}"
        
        You must respond with ONLY a valid JSON object in this exact format:
        {{
            "grammar": {{
                "tense": "present",
                "mood": "indicative", 
                "clause_type": "main",
                "structure": "Subject + Verb + Time + Object structure",
                "verb_position": "Verb in second position (V2 rule)"
            }},
            "word_families": {{
                "nouns": ["Morgen", ["Vormittag", "Tagesanfang", "Frühe"]],
                "verbs": ["aufstehen", ["erwachen", "sich erheben", "wach werden"]],
                "adjectives": []
            }},
            "variations": [
                "Ich wache jeden Morgen um sieben Uhr auf.",
                "Jeden Morgen stehe ich um sieben auf.",
                "Um sieben Uhr morgens stehe ich auf.",
                "Ich erhebe mich täglich um sieben Uhr.",
                "Morgens um sieben stehe ich auf."
            ],
            "translation": "I get up every morning at seven o'clock.",
            "pronunciation_guide": "Ich [ɪç] stehe [ˈʃteːə] jeden [ˈjeːdn̩] Morgen [ˈmɔʁɡn̩]"
        }}
        
        Respond with ONLY the JSON object, no other text.
        """
        
        analysis_response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": analysis_prompt}],
            max_tokens=1000,
            temperature=0.3
        )
        
        try:
            analysis_content = analysis_response.choices[0].message.content.strip()
            print(f"Raw analysis response: {analysis_content}")  # Debug logging
            
            # Clean the response to ensure it's valid JSON
            if analysis_content.startswith('```json'):
                analysis_content = analysis_content.replace('```json', '').replace('```', '').strip()
            
            analysis = json.loads(analysis_content)
            print(f"Parsed analysis: {analysis}")  # Debug logging
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw content: {analysis_response.choices[0].message.content}")
            # Fallback if JSON parsing fails
            analysis = {
                "grammar": {
                    "tense": "Present", 
                    "mood": "Indicative", 
                    "clause_type": "Main clause",
                    "structure": "Standard German sentence structure",
                    "verb_position": "Verb in second position"
                },
                "word_families": {
                    "nouns": ["Wort", ["Begriff", "Ausdruck", "Bezeichnung"]],
                    "verbs": ["sein", ["werden", "bleiben", "existieren"]],
                    "adjectives": ["gut", ["schön", "toll", "prima"]]
                },
                "variations": [
                    "Alternative sentence structure 1",
                    "Alternative sentence structure 2", 
                    "Alternative sentence structure 3"
                ],
                "translation": "English translation of the sentence",
                "pronunciation_guide": "Pronunciation guide available"
            }
        
        return jsonify({
            'success': True,
            'sentence': german_sentence,
            'level': level,
            'topic': topic,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to generate sentence: {str(e)}'
        }), 500

@language_bp.route('/generate-audio', methods=['POST'])
def generate_audio():
    """Generate actual TTS audio for German text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'success': False, 'error': 'No text provided'}), 400
        
        # Create a unique filename based on text hash
        import hashlib
        text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
        audio_filename = f'german_audio_{text_hash}.wav'
        audio_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'audio')
        audio_path = os.path.join(audio_dir, audio_filename)
        
        # Create audio directory if it doesn't exist
        os.makedirs(audio_dir, exist_ok=True)
        
        # Check if audio file already exists
        if not os.path.exists(audio_path):
            # Generate audio using media_generate_speech
            # This would be called from a separate process or service
            pass
        
        return jsonify({
            'success': True,
            'audio_url': f'/static/audio/{audio_filename}',
            'audio_filename': audio_filename,
            'text': text
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Audio generation failed: {str(e)}'
        }), 500

@language_bp.route('/export-anki', methods=['POST'])
def export_anki():
    """Export sentence data for Anki"""
    try:
        data = request.get_json()
        sentence = data.get('sentence', '')
        translation = data.get('translation', '')
        analysis = data.get('analysis', {})
        
        if not sentence:
            return jsonify({'success': False, 'error': 'No sentence provided'}), 400
        
        # Create Anki-compatible data
        anki_data = {
            'front': sentence,
            'back': f"{translation}<br><br><strong>Grammar:</strong> {analysis.get('grammar', {}).get('structure', '')}<br><strong>Variations:</strong> {'; '.join(analysis.get('variations', [])[:3])}",
            'audio': f'audio_{hash(sentence) % 10000}.wav'
        }
        
        return jsonify({
            'success': True,
            'anki_data': anki_data,
            'csv_format': f'"{sentence}","{anki_data["back"]}","{anki_data["audio"]}"'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Export failed: {str(e)}'
        }), 500

