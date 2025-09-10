from flask import Blueprint, request, jsonify, session
from utils.openai_client import get_response_from_openai

voice_bp = Blueprint("voice", __name__, url_prefix="/api/voice")

# Initialize conversation history in session
@voice_bp.before_request
def initialize_conversation():
    if 'conversation' not in session:
        session['conversation'] = [
            {"role": "system", "content": "You are a helpful AI voice assistant."}
        ]

@voice_bp.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Add user message to conversation history
        session['conversation'].append({"role": "user", "content": prompt})
        
        # Get response using full conversation history
        response = get_response_from_openai(session['conversation'])
        
        # Add AI response to conversation history
        session['conversation'].append({"role": "assistant", "content": response})
        
        # Keep conversation history manageable (last 10 messages)
        if len(session['conversation']) > 20:  # system + 10 exchanges
            session['conversation'] = [session['conversation'][0]] + session['conversation'][-19:]
        
        session.modified = True  # Mark session as modified
        return jsonify({"response": response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@voice_bp.route("/clear", methods=["POST"])
def clear_conversation():
    """Clear the conversation history"""
    try:
        if 'conversation' in session:
            # Reset to just system message
            session['conversation'] = [
                {"role": "system", "content": "You are a helpful AI voice assistant."}
            ]
            session.modified = True
        return jsonify({"status": "conversation cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500