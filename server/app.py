import os
from flask import Flask
from flask_cors import CORS
from voice import voice_bp

app = Flask(__name__)

# Load secrets from env
app.secret_key = os.getenv("SECRET_KEY", "default-secret")

# Read allowed origins from env (comma-separated)
origins = os.getenv("CORS_ORIGINS", "").split(",")

CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": origins}}
)

# Register routes
app.register_blueprint(voice_bp)

@app.route("/")
def home():
    return "Voice Agent API is running."

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, port=port, host="0.0.0.0")
