from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from ../.env file (since app.py is inside frontend/backend)
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

# Initialize Flask App
app = Flask(__name__)

# Configure Gemini
if api_key and api_key != "PASTE_YOUR_API_KEY_HERE":
    genai.configure(api_key=api_key)
    # Use the 2.0 Flash model for fast, standard chat responses
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction="You are Dora, a fun, helpful, and energetic chat buddy created by Akshit. Keep your answers relatively concise, highly engaging, and use emojis."
    )
    chat_session = model.start_chat(history=[])
else:
    model = None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    if not model:
        return jsonify({"error": "Missing GEMINI_API_KEY in .env file"}), 401

    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Send message to Gemini
        response = chat_session.send_message(user_message)
        return jsonify({"reply": response.text})
    except Exception as e:
        error_msg = str(e).lower()
        if "429" in error_msg or "quota" in error_msg or "exhausted" in error_msg:
            return jsonify({
                "reply": "Phew! I've been talking so much today, my brain needs a quick nap! 😴 Tell me more in a little bit!",
                "quota_exceeded": True
            })
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000, debug=True)
