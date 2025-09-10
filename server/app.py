from flask import Flask
from flask_cors import CORS
from voice import voice_bp

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Add a secret key for sessions
CORS(app, supports_credentials=True)  # Enable credentials for sessions

# Register routes
app.register_blueprint(voice_bp)

@app.route("/")
def home():
    return "Voice Agent API is running."

if __name__ == "__main__":
    app.run(debug=True, port=5000)