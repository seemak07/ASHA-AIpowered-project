from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import re
import os

app = Flask(__name__)
CORS(app)

LANGUAGE_NAMES = {
    "hi": "Hindi", "kn": "Kannada", "te": "Telugu", "ta": "Tamil",
    "ml": "Malayalam", "mr": "Marathi", "gu": "Gujarati", "bn": "Bengali",
    "pa": "Punjabi", "or": "Odia", "ur": "Urdu", "as": "Assamese", "en": "English"
}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ASHA backend is running ✅"})


@app.route("/analyse", methods=["POST"])
def analyse():
    try:
        data = request.get_json()
        lang_code = data.get("lang_code", "en")
        lang_name = LANGUAGE_NAMES.get(lang_code, "English")
        image_b64 = data.get("image")
        spoken_text = data.get("text")

        # Get API key from request (sent from frontend)
        api_key = data.get("api_key") or os.environ.get("GEMINI_API_KEY", "")

        if not api_key:
            return jsonify({"error": "No API key provided. Please add your Gemini API key in Settings."}), 401

        # Configure Gemini with the key
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        system_prompt = f"""
You are ASHA, an AI medical assistant that helps illiterate and rural patients in India
understand their prescriptions. Explain everything in very simple words.

TASK: Read the prescription and return ONLY a valid JSON object. No markdown, no extra text.

OUTPUT FORMAT:
{{
  "doctor": "Doctor name or Unknown",
  "date": "Date on prescription or Today",
  "followup": "Follow-up instructions if any",
  "medicines": [
    {{
      "name": "Medicine name and dose",
      "times": "How many times per day in simple words",
      "when": "Before food / After food / With water",
      "days": "For how many days",
      "for": "What this medicine is for in simple language",
      "warning": "Important warning in simple words"
    }}
  ],
  "summary_text": "A complete friendly explanation of ALL medicines in {lang_name} language.
                   Use very simple words a village person would understand.
                   Speak like a helpful friend, not a doctor."
}}

RULES:
- summary_text MUST be in {lang_name} language
- Medicine names stay in English
- times/when/days/for/warning — translate to {lang_name}
- No medical jargon
"""

        if image_b64:
            if "," in image_b64:
                image_b64 = image_b64.split(",")[1]
            image_data = {"mime_type": "image/jpeg", "data": image_b64}
            response = model.generate_content([system_prompt, "Read this prescription:", image_data])
        elif spoken_text:
            response = model.generate_content([
                system_prompt,
                f"Patient described medicines as: '{spoken_text}'. Extract medicine information."
            ])
        else:
            return jsonify({"error": "No image or text provided"}), 400

        raw = response.text.strip()
        raw = re.sub(r"```json\s*", "", raw)
        raw = re.sub(r"```\s*", "", raw)
        result = json.loads(raw.strip())
        return jsonify(result)

    except json.JSONDecodeError:
        return jsonify({"error": "Could not read prescription clearly. Please try a clearer image."}), 422
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🩺 ASHA Backend starting on http://localhost:5000")
    app.run(debug=True, port=5000)
