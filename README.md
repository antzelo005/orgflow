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

- Login page screenshot
  <img width="1871" height="915" alt="image" src="https://github.com/user-attachments/assets/4c1245e5-0c11-4a11-aac3-e9bdf6be7a3f" />

- Dashboard overview screenshot
  <img width="1874" height="910" alt="image" src="https://github.com/user-attachments/assets/a638475a-ce2d-46da-a935-55c55a72c411" />

- Employees management screenshot
  <img width="1843" height="905" alt="image" src="https://github.com/user-attachments/assets/1c4cc88e-c5fa-43f4-ada3-db93b5416213" />

- Departments management screenshot
  <img width="1848" height="896" alt="image" src="https://github.com/user-attachments/assets/3e1f6a5e-ea49-4661-b535-524f9a3f9b03" />

- Organizational chart screenshot
- <img width="1838" height="903" alt="image" src="https://github.com/user-attachments/assets/38650563-206d-4e79-b14a-3ff0c9405e9b" />


## Features

- JWT-based authentication with login and registration
- Role-based access control with `Admin` and `Viewer` roles
- Department CRUD with name, description, and location
- Department open positions tracking
- Employee CRUD with manager relationships and department assignment
- Organizational hierarchy with top-level employees and nested reporting lines
- Expand/collapse organizational chart view
- Dashboard metrics for workforce and departments
- CSV export for employees and departments
- Admin CSV import for employee bulk creation
- Manager visibility with direct report counts and subordinate lists
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
- CSV import and export workflows
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
- One department can define a lightweight `open_positions` count for vacant roles

This manager relationship enables a recursive organizational tree structure for chart visualization.

## Authentication and Roles

OrgFlow uses JWT authentication with access and refresh tokens.

### Roles

- `Admin`
  - Created only through Django admin, `createsuperuser`, or the demo seed command
  - Can create, update, and delete departments and employees
  - Can access all read endpoints
- `Viewer`
  - Default role for all public registrations
  - Can read data
  - Cannot create, edit, or delete records

### Authentication Endpoints

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Registration Rules

- Public registration always creates a `viewer` account
- The register endpoint does not allow clients to choose `admin`
- Administrative users must be created through Django admin, `python manage.py createsuperuser`, or `python manage.py seed_demo_data`

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
DB_PASSWORD= password
DB_HOST=localhost
DB_PORT=port

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
- `GET /api/departments/export/`
- `GET /api/departments/{id}/`
- `PUT /api/departments/{id}/`
- `DELETE /api/departments/{id}/`

### Employees

- `GET /api/employees/`
- `POST /api/employees/`
- `GET /api/employees/export/`
- `POST /api/employees/import-csv/`
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

## Export and Import Usage

### CSV Export

- Employees can be exported from the Employees page using the `Export CSV` button
- Departments can be exported from the Departments page using the `Export CSV` button
- Employee export respects the currently selected search and filter values

### CSV Import

- Admin users can bulk import employees from the Employees page using the `Import CSV` button
- The uploaded CSV must include these required columns:
  - `first_name`
  - `last_name`
  - `email`
  - `job_title`
  - `department`
  - `hire_date`
- Optional columns:
  - `phone`
  - `manager_email`
  - `status`
  - `profile_image_url`
- `hire_date` must use `YYYY-MM-DD`
- `department` must match an existing department name
- `manager_email` must match an existing employee email if provided

Example employee import header:

```csv
first_name,last_name,email,phone,job_title,department,manager_email,hire_date,status,profile_image_url
```

## Vacant Positions

Vacant roles are tracked through the `open_positions` field on each department.

- Departments can define how many open roles currently exist
- The value appears on the Departments page
- The dashboard shows total open positions across the organization
- Department metrics show both employee count and open positions

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
|-- backend/
|   |-- apps/
|   |   |-- accounts/
|   |   `-- organization/
|   |-- config/
|   |-- manage.py
|   |-- requirements.txt
|   `-- .env.example
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- app/
|   |   |-- components/
|   |   |-- features/
|   |   |-- pages/
|   |   `-- styles/
|   |-- package.json
|   `-- .env.example
`-- README.md
```

## Security Considerations

- Sensitive configuration is stored in environment variables
- JWT is used instead of session-based frontend authentication
- Protected routes prevent unauthorized frontend access
- Role-based permissions restrict write operations to admins
- CSV import validates required fields, department existence, duplicate emails, and manager references
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
- Export to PDF
- Activity logs and audit history
- Password reset workflow
- Unit and integration test coverage expansion
- Docker-based deployment workflow
- CI/CD pipeline integration

## License
This project is provided for educational and portfolio purposes.



## Credits

- Developed as a university assignment project
- Built with Django, Django REST Framework, PostgreSQL, React, TypeScript, and Vite
- UI direction inspired by modern corporate SaaS dashboard design patterns
