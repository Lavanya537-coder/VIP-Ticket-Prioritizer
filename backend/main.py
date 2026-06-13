from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import json

from app.database import Base, engine, get_db
from app.models.ticket import Ticket
from services.gemini_service import analyze_ticket
from services.discord_service import send_alert

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VIP Ticket Prioritizer",
    version="1.0"
)
app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

VIP_USERS = {
    "ceo@company.com": "CRITICAL",
    "director@company.com": "HIGH",
    "manager@company.com": "MEDIUM"
}


@app.get("/")
def home():
    return {
        "message": "VIP Ticket Prioritizer Running"
    }


@app.post("/tickets")
def create_ticket(
    ticket: dict,
    db: Session = Depends(get_db)
):
    email = ticket["email"]
    priority = VIP_USERS.get(email, "LOW")

    category = ""
    ai_summary = ""
    suggested_resolution = ""

    try:
        ai_response = analyze_ticket(
            ticket["issue_description"]
        )

        cleaned = (
            ai_response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        result = json.loads(cleaned)

        category = result.get("category", "")
        ai_summary = result.get("summary", "")
        suggested_resolution = result.get(
            "suggested_resolution",
            ""
        )

        if category.lower() in [
            "security",
            "data loss",
            "cybersecurity"
        ]:
            priority = "CRITICAL"

    except Exception as e:
        category = "Unknown"
        ai_summary = f"AI Error: {str(e)}"
        suggested_resolution = "No suggestion available"

    new_ticket = Ticket(
        employee_name=ticket["employee_name"],
        email=ticket["email"],
        department=ticket["department"],
        issue_title=ticket["issue_title"],
        issue_description=ticket["issue_description"],
        priority=priority,
        category=category,
        ai_summary=ai_summary,
        suggested_resolution=suggested_resolution
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    response_data = {
        "message": "Ticket Created",
        "ticket_id": new_ticket.id,
        "employee_name": ticket["employee_name"],
        "issue_title": ticket["issue_title"],
        "priority": priority,
        "category": category,
        "summary": ai_summary,
        "suggested_resolution": suggested_resolution
    }

    if priority in ["HIGH", "CRITICAL"]:
        send_alert(response_data)

    return response_data


@app.get("/tickets")
def get_tickets(db: Session = Depends(get_db)):

    tickets = db.query(Ticket).all()

    priority_order = {
        "CRITICAL": 4,
        "HIGH": 3,
        "MEDIUM": 2,
        "LOW": 1
    }

    sorted_tickets = sorted(
        tickets,
        key=lambda x: priority_order.get(
            x.priority,
            0
        ),
        reverse=True
    )

    return sorted_tickets


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()

    total = len(tickets)
    critical = len(
        [t for t in tickets if t.priority == "CRITICAL"]
    )
    high = len(
        [t for t in tickets if t.priority == "HIGH"]
    )
    medium = len(
        [t for t in tickets if t.priority == "MEDIUM"]
    )
    low = len(
        [t for t in tickets if t.priority == "LOW"]
    )

    return {
        "total_tickets": total,
        "critical_tickets": critical,
        "high_priority_tickets": high,
        "medium_priority_tickets": medium,
        "low_priority_tickets": low
    }