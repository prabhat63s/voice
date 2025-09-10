Voice Agent Backend
Overview

This project implements a Voice AI Assistant backend using Flask and the OpenAI API.
It allows the frontend (web or mobile) to send user voice/text input, receive AI-generated responses, and maintain a conversation history.

Table of Contents

Project Structure

Environment Setup

Dependencies

API Endpoints

Conversation Management

OpenAI Integration

Usage

Deployment

Project Structure
server/
├─ app.py                 # Flask app entry point
├─ config.py              # Environment variable loader
├─ requirements.txt       # Python dependencies
├─ utils/
│  └─ openai_client.py    # OpenAI API wrapper
└─ voice.py               # Flask Blueprint for voice API

Environment Setup

Create a .env file in the server folder:

OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_flask_secret_key
CORS_ORIGINS=http://localhost:3000
PORT=5000
FLASK_DEBUG=true


Install dependencies:

pip install -r requirements.txt

Dependencies

Flask – Web framework

flask-cors – Enable CORS for frontend integration

openai – OpenAI API client

python-dotenv – Load environment variables

gunicorn – Optional for production deployment

API Endpoints
POST /api/voice/ask

Sends a user prompt to OpenAI and returns AI response.

Request Body:

{
  "prompt": "Hello, how are you?"
}


Response:

{
  "response": "I’m doing great! How can I assist you today?"
}

POST /api/voice/clear

Clears conversation history in session.

Response:

{
  "status": "conversation cleared"
}

GET /

Health check endpoint.

Response:

Voice Agent API is running.

Conversation Management

Uses Flask session to store conversation history

Initial system message:

{"role": "system", "content": "You are a helpful AI voice assistant."}


User messages: "role": "user"

AI responses: "role": "assistant"

History limit: last 20 messages are kept to avoid session bloat

OpenAI Integration

File: utils/openai_client.py

Model: gpt-4.1-mini

temperature: 0.7 – for creative responses

max_tokens: 200 – response length limit

Usage: Called by /api/voice/ask endpoint with full conversation history

Example usage:

response = get_response_from_openai(session['conversation'])

Usage

Start the Flask server:

python app.py


Frontend can send POST requests to /api/voice/ask with user input.

AI response is returned and stored in session for context-aware conversations.

Use /api/voice/clear to reset conversation.

Deployment

Development:

python app.py


Production (Optional Gunicorn):

gunicorn -w 4 -b 0.0.0.0:5000 app:app


Ensure CORS_ORIGINS points to your frontend URL(s).