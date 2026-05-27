# OrgFlow

[![Django](https://img.shields.io/badge/Backend-Django%205-0C4B33?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/API-Django%20REST%20Framework-A30000?style=for-the-badge)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-111827?style=for-the-badge)](https://jwt.io/)

Professional full-stack web application for managing a company's internal structure, reporting hierarchy, departments, and workforce directory. OrgFlow was built as a university assignment project for Theme 17: Corporate Organizational Chart / Company Structure Management System, with a portfolio-ready SaaS dashboard presentation and practical CRUD-driven architecture.

## Overview

OrgFlow helps organizations model their internal structure in a clean and accessible way. It combines role-based access control, employee and department management, dashboard analytics, and a visual organizational chart into a modern responsive interface.

The project is designed to be:

- Student-project ready for assignment submission
- Easy to run locally with PostgreSQL
- Structured like a real-world full-stack product
- Presentable for GitHub portfolios and recruiter review

## Screenshots

- Login page screenshot (`(assets/screenshots/login-page.png)`)
- Dashboard overview screenshot (`(assets/screenshots/dashboard-overview.png)`)
- Employees management screenshot (`(assets/screenshots/employees-page.png)`)
- Departments management screenshot (`(assets/screenshots/departments-page.png)`)
- Organizational chart screenshot (`(assets/screenshots/org-chart-page.png)`)

Replace the placeholder paths above with actual screenshots after capturing the UI.

## Features

- JWT-based authentication with login and registration
- Role-based access control with `Admin` and `Viewer` roles
- Department CRUD with name, description, and location
- Employee CRUD with manager relationships and department assignment
- Organizational hierarchy with top-level employees and nested reporting lines
- Expand/collapse organizational chart view
- Dashboard metrics for workforce and departments
- Employee search by name, email, and job title
- Filters by department and employee status
- Protected frontend routes
- Responsive dark corporate dashboard UI
- Loading states, empty states, error handling, and toast notifications
- Seed command for demo data and quick local testing

## Tech Stack

### Backend

- Django 5
- Django REST Framework
- Simple JWT
- PostgreSQL
- `psycopg`
- `python-dotenv`

### Frontend

- React 18
- TypeScript
- Vite
- Axios
- React Router
- React Hot Toast
- Lucide React

## Architecture Overview

OrgFlow follows a decoupled client-server architecture:

- The Django backend exposes a REST API for authentication, departments, employees, dashboard metrics, and organizational hierarchy.
- PostgreSQL stores persistent business data including users, departments, employees, and reporting relationships.
- The React frontend consumes the API through Axios and manages routing, protected pages, forms, tables, filters, and tree rendering.
- JWT access and refresh tokens are used for stateless API authentication.

### High-Level Flow

1. A user logs in from the React client.
2. The Django API issues JWT access and refresh tokens.
3. Protected frontend pages send authenticated requests to the REST API.
4. The backend enforces permissions based on user role.
5. Data is rendered in tables, cards, profile views, and the organizational chart.

## Backend / Frontend Structure

### Backend Responsibilities

- Authentication and authorization
- REST API endpoints
- Business rules for departments and employees
- Role permissions
- Dashboard summary data
- Organizational tree data
- Demo data seeding

### Frontend Responsibilities

- Authentication flow and token persistence
- Route protection
- Dashboard presentation
- CRUD forms and modal interactions
- Employee search and filtering
- Organizational chart rendering
- Responsive UI and user feedback states

## Database Overview

The database is centered around three main entities:

- `User`
  - Stores authentication details and role (`admin` or `viewer`)
- `Department`
  - Stores department metadata such as name, description, and location
- `Employee`
  - Stores employee profile data and links to a department and optional manager

### Core Relationships

- One department can have many employees
- One employee belongs to one department
- One employee can have one manager
- One manager can supervise many employees

This manager relationship enables a recursive organizational tree structure for chart visualization.

## Authentication and Roles

OrgFlow uses JWT authentication with access and refresh tokens.

### Roles

- `Admin`
  - Can create, update, and delete departments and employees
  - Can access all read endpoints
- `Viewer`
  - Can read data
  - Cannot create, edit, or delete records

### Authentication Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

## Responsive Design

The frontend is designed with a responsive dark corporate theme optimized for:

- Desktop dashboards
- Tablet layouts
- Mobile-friendly stacked content sections

The interface includes responsive navigation, adaptable grids, and components that remain usable across different screen sizes.

## Installation and Setup

## 1. Clone the Repository

```powershell
git clone <your-repository-url>
cd orgManagement
```

## 2. Backend Setup

```powershell
cd backend
copy .env.example .env
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

Backend runs on:

```text
http://127.0.0.1:8000/
```

API base URL:

```text
http://127.0.0.1:8000/api/
```

## 3. Frontend Setup

Open a second terminal:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173/
```

## Environment Variables Setup

### Backend `.env`

```env
DEBUG=True
SECRET_KEY=change-me
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=org_management_db
DB_USER=org_user
DB_PASSWORD=1252
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## API Overview

### Authentication

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Dashboard

- `GET /api/dashboard/`

### Organizational Chart

- `GET /api/org-chart/`

### Departments

- `GET /api/departments/`
- `POST /api/departments/`
- `GET /api/departments/{id}/`
- `PUT /api/departments/{id}/`
- `DELETE /api/departments/{id}/`

### Employees

- `GET /api/employees/`
- `POST /api/employees/`
- `GET /api/employees/{id}/`
- `PUT /api/employees/{id}/`
- `DELETE /api/employees/{id}/`

### Employee Search and Filters

The employee list supports query parameters such as:

- `search`
- `department`
- `status`

Example:

```text
/api/employees/?search=manager&department=2&status=active
```

## Demo Credentials

After running:

```powershell
python manage.py seed_demo_data
```

Use these accounts:

- Admin account
  - Username: `admin`
  - Password: `Admin12345!`
- Viewer account
  - Username: `viewer`
  - Password: `Viewer12345!`

## Folder Structure

```text
orgManagement/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   └── organization/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Security Considerations

- Sensitive configuration is stored in environment variables
- JWT is used instead of session-based frontend authentication
- Protected routes prevent unauthorized frontend access
- Role-based permissions restrict write operations to admins
- Passwords are stored using Django's secure hashing system
- No database credentials are hardcoded directly inside application logic

For production use, additional improvements would include:

- HTTPS-only deployment
- Rotating secrets and stronger environment separation
- Stricter CORS configuration
- Rate limiting for authentication endpoints
- Audit logging for administrative actions

## Future Improvements

- Drag-and-drop org chart editing
- Employee profile image upload support
- Pagination for large employee datasets
- Department-level analytics visualizations
- Export to PDF or CSV
- Activity logs and audit history
- Password reset workflow
- Unit and integration test coverage expansion
- Docker-based deployment workflow
- CI/CD pipeline integration

## License

This project is provided for educational and portfolio purposes.

You can replace this section with a formal license such as `MIT` if you plan to publish the repository publicly.

## Credits

- Developed as a university assignment project for Theme 17
- Built with Django, Django REST Framework, PostgreSQL, React, TypeScript, and Vite
- UI direction inspired by modern corporate SaaS dashboard design patterns
