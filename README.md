# HireCraft

A full-stack placement preparation platform built with Flask (backend) and React + Vite (frontend).

## Features

- **Mock Tests** — Timed tests with automatic scoring and detailed analysis
- **Code Practice** — Curated coding problems sorted by topic and company
- **Placement Drives** — Browse and apply to active campus recruitment drives
- **Prep Materials** — Articles, PDFs, and video resources for interview preparation
- **Admin Dashboard** — Manage tests, questions, drives, materials, and students

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Flask, SQLAlchemy, MySQL |
| Auth | Server-side sessions with bcrypt password hashing |

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `backend/.env` file:
```
SQLALCHEMY_DATABASE_URI=mysql+pymysql://user:password@localhost/hirecraft
SECRET_KEY=your-secret-key
FLASK_DEBUG=true
```
