
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_ticket(issue):
    prompt = f"""
Analyze this IT support ticket.

Return ONLY valid JSON.

{{
  "category": "",
  "summary": "",
  "suggested_resolution": ""
}}

Ticket:
{issue}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text

