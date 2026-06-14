# VIP Ticket Prioritizer    LINK->https://vip-ticket-prioritizer.vercel.app/

## Overview

VIP Ticket Prioritizer is an AI-powered Service Desk system designed to automatically identify, analyze, prioritize, and escalate support tickets raised by high-value employees such as CEOs, Directors, and Managers.

The system combines Rule-Based Prioritization, AI Ticket Analysis, and Real-Time Discord Notifications to help IT support teams respond faster to critical incidents.

---

## Problem Statement

In traditional service desks, VIP employee tickets often get mixed with regular support requests, resulting in delayed responses for critical business issues.

This project automatically:

* Detects VIP users
* Assigns ticket priority
* Generates AI summaries
* Categorizes incidents
* Sends real-time alerts
* Displays ticket analytics

---

## Features

### AI Ticket Analysis

* Automatic ticket categorization
* AI-generated summaries
* Suggested resolutions
* Security incident detection

### VIP Prioritization

* CEO → Critical Priority
* Director → High Priority
* Manager → Medium Priority
* Others → Low Priority

### Real-Time Alerts

* Discord notifications
* Instant escalation for critical tickets

### Dashboard Analytics

* Total tickets
* Critical tickets
* High priority tickets
* Medium priority tickets
* Low priority tickets

### Ticket Queue

* Sorted based on priority
* Critical tickets displayed first

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite

### AI

* Google Gemini API

### Notifications

* Discord Webhooks

### Deployment

* Vercel (Frontend)
* Render (Backend)

### Version Control

* Git
* GitHub

---

## Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
FastAPI Backend
 │
 ├── VIP Rule Engine
 │
 ├── Gemini AI Analysis
 │
 ├── SQLite Database
 │
 └── Discord Alerts
```

---

## Workflow

1. User submits a ticket.
2. Backend checks VIP status.
3. Gemini AI analyzes the issue.
4. Category and summary are generated.
5. Priority is assigned.
6. Ticket is stored in SQLite.
7. Discord alert is triggered for VIP tickets.
8. Dashboard updates automatically.

---

## Project Structure

```text
VIP-Ticket-Prioritizer
│
├── backend
│   ├── app
│   │   ├── database.py
│   │   └── models
│   │
│   ├── services
│   │   ├── gemini_service.py
│   │   ├── discord_service.py
│   │   └── priority_engine.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   └── services
│   │
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

---

## API Endpoints

### Home

```http
GET /
```

### Create Ticket

```http
POST /tickets
```

### Get Tickets

```http
GET /tickets
```

### Dashboard Statistics

```http
GET /dashboard
```

### Demo Data

```http
GET /seed-demo-data
```

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

```env
GEMINI_API_KEY=your_api_key

DISCORD_WEBHOOK_URL=your_webhook_url
```

---

## AI Capabilities Demonstrated

* AI-Assisted Development
* External API Integration
* AI Ticket Classification
* AI Ticket Summarization
* Automated Decision Making

---

## Future Enhancements

* Multi-level approval workflow
* SLA monitoring
* Email notifications
* Role-based authentication
* Cloud database integration
* Predictive ticket escalation

---

## Team Contribution

This project was developed as a hackathon solution to demonstrate how AI can improve enterprise service desk operations through intelligent ticket prioritization and automated incident management.

---

## License

MIT License
