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
  @app.get("/seed-demo-data")
def seed_demo_data(db: Session = Depends(get_db)):

```
demo_tickets = [

    Ticket(
        employee_name="Rahul Sharma",
        email="ceo@company.com",
        department="Executive",
        issue_title="Email Server Outage",
        issue_description="Unable to send or receive emails before board meeting",
        priority="CRITICAL",
        category="Email Infrastructure",
        ai_summary="CEO unable to access corporate email services before an important meeting.",
        suggested_resolution="Verify Exchange services and mail routing."
    ),

    Ticket(
        employee_name="Anjali Verma",
        email="director@company.com",
        department="Finance",
        issue_title="Database Access Failure",
        issue_description="Cannot access quarterly reports",
        priority="HIGH",
        category="Database Access",
        ai_summary="Director unable to access reporting database.",
        suggested_resolution="Verify permissions and database connectivity."
    ),

    Ticket(
        employee_name="Vikram Rao",
        email="ceo@company.com",
        department="Operations",
        issue_title="Laptop Blue Screen",
        issue_description="System crashes during startup",
        priority="CRITICAL",
        category="Hardware Failure",
        ai_summary="Executive laptop crashes during boot.",
        suggested_resolution="Run diagnostics and analyze crash dumps."
    ),

    Ticket(
        employee_name="Priya Nair",
        email="manager@company.com",
        department="HR",
        issue_title="VPN Connectivity Failure",
        issue_description="Unable to connect remotely",
        priority="MEDIUM",
        category="VPN Connectivity",
        ai_summary="Manager unable to establish VPN connection.",
        suggested_resolution="Reset VPN credentials and verify connectivity."
    ),

    Ticket(
        employee_name="Arjun Patel",
        email="director@company.com",
        department="Engineering",
        issue_title="Source Control Access Denied",
        issue_description="Git repository access lost",
        priority="HIGH",
        category="Access Management",
        ai_summary="Director cannot access source code repositories.",
        suggested_resolution="Restore repository permissions."
    ),

    Ticket(
        employee_name="Suresh Kumar",
        email="ceo@company.com",
        department="Management",
        issue_title="Data Corruption",
        issue_description="Project files corrupted",
        priority="CRITICAL",
        category="Data Recovery",
        ai_summary="Critical business files became corrupted.",
        suggested_resolution="Restore latest backup immediately."
    ),

    Ticket(
        employee_name="Kiran Reddy",
        email="manager@company.com",
        department="IT",
        issue_title="Printer Offline",
        issue_description="Office printer not responding",
        priority="LOW",
        category="Hardware Support",
        ai_summary="Network printer unavailable.",
        suggested_resolution="Check printer connectivity and restart device."
    ),

    Ticket(
        employee_name="Meena Sharma",
        email="director@company.com",
        department="Sales",
        issue_title="CRM Access Issue",
        issue_description="Cannot login to CRM",
        priority="HIGH",
        category="Application Access",
        ai_summary="Director unable to access CRM platform.",
        suggested_resolution="Reset credentials and verify account status."
    ),

    Ticket(
        employee_name="Rohit Singh",
        email="ceo@company.com",
        department="Operations",
        issue_title="Server Down",
        issue_description="Production server unavailable",
        priority="CRITICAL",
        category="Infrastructure",
        ai_summary="Production application server unavailable.",
        suggested_resolution="Investigate server logs and restart services."
    ),

    Ticket(
        employee_name="Deepika Rao",
        email="manager@company.com",
        department="Support",
        issue_title="Email Sync Problem",
        issue_description="Emails not syncing on mobile",
        priority="MEDIUM",
        category="Email Support",
        ai_summary="User unable to sync corporate emails.",
        suggested_resolution="Reconfigure mail profile."
    )
]

for ticket in demo_tickets:
    db.add(ticket)

db.commit()

return {
    "message": "10 demo tickets inserted successfully"
}
```
