
import requests

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

WEBHOOK_URL = os.getenv("WEBHOOK_URL")

def send_alert(ticket_data):
    payload = {
        "content": f"""
🚨 VIP TICKET DETECTED

Employee: {ticket_data['employee_name']}

Priority: {ticket_data['priority']}

Category: {ticket_data['category']}

Issue: {ticket_data['issue_title']}

AI Summary: {ticket_data['summary']}
"""
    }

    response = requests.post(
        WEBHOOK_URL,
        json=payload
    )

    return response.status_code

