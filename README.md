# OrgFlow - Theme 17 Corporate Organizational Chart / Company Structure Management System

Full-stack student project using Django REST Framework, PostgreSQL, JWT authentication, and React + TypeScript + Vite.

## Stack

- Backend: Django 5 + Django REST Framework
- Database: PostgreSQL
- Auth: JWT with `djangorestframework-simplejwt`
- Frontend: React 18 + TypeScript + Vite
- Styling: responsive dark corporate dashboard UI

## Project Structure

```text
orgManagement/
├── backend/
└── frontend/
```

## Features

- Register and login with JWT
- User roles: `admin` and `viewer`
- Department CRUD
- Employee CRUD
- Manager/subordinate hierarchy
- Organizational chart with expand/collapse
- Dashboard metrics
- Employee search and filters
- Protected frontend routes
- Loading, empty, and error states
- Demo seed command

## PostgreSQL Setup

The backend is already configured to use environment variables and matches the database details shown in your screenshot:

- Database: `org_management_db`
- User: `org_user`
- Password: `1252`

## Backend Setup

1. Install Python 3.11+ if it is not already available on your machine.
2. Create a virtual environment inside `backend`.
3. Install dependencies:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

4. Create `.env` from `.env.example`.
5. Run migrations:

```powershell
python manage.py migrate
```

6. Seed demo data:

```powershell
python manage.py seed_demo_data
```

7. Start the API:

```powershell
python manage.py runserver
```

Backend base URL: `http://127.0.0.1:8000/api`

### Demo Accounts

- Admin: `admin` / `Admin12345!`
- Viewer: `viewer` / `Viewer12345!`

## Frontend Setup

1. Open a new terminal:

```powershell
cd frontend
npm install
```

2. Create `.env` from `.env.example`.
3. Start the frontend:

```powershell
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Overview

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `GET /api/dashboard/`
- `GET /api/org-chart/`
- `GET/POST/PUT/DELETE /api/departments/`
- `GET/POST/PUT/DELETE /api/employees/`

## Role Permissions

- Admin: full create, update, delete access
- Viewer: read-only access

## Notes

- All sensitive settings are environment-based.
- The backend expects PostgreSQL, not SQLite.
- If your Windows machine does not currently expose a working `python` command, install Python and ensure it is added to `PATH` before running the backend.
