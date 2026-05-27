from datetime import date, timedelta
import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.organization.models import Department, Employee

User = get_user_model()


class Command(BaseCommand):
    help = "Seed demo users, departments, and employees for local development."

    def handle(self, *args, **options):
        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@orgflow.local",
                "first_name": "System",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
            },
        )
        admin_user.set_password("Admin12345!")
        admin_user.save()

        viewer_user, _ = User.objects.get_or_create(
            username="viewer",
            defaults={
                "email": "viewer@orgflow.local",
                "first_name": "Team",
                "last_name": "Viewer",
                "role": User.Role.VIEWER,
            },
        )
        viewer_user.set_password("Viewer12345!")
        viewer_user.save()

        departments_data = [
            ("Executive", "Strategic leadership and corporate planning", "Athens HQ"),
            ("Engineering", "Product engineering and platform delivery", "Athens HQ"),
            ("Human Resources", "Talent operations and people support", "Patras Office"),
            ("Finance", "Accounting, payroll, and forecasts", "Thessaloniki Office"),
            ("Sales", "Customer acquisition and partnerships", "Remote"),
        ]

        departments = []
        for name, description, location in departments_data:
            department, _ = Department.objects.get_or_create(
                name=name,
                defaults={"description": description, "location": location},
            )
            departments.append(department)

        ceo, _ = Employee.objects.get_or_create(
            email="elena.karalis@orgflow.local",
            defaults={
                "first_name": "Elena",
                "last_name": "Karalis",
                "phone": "+30 210 0000001",
                "job_title": "Chief Executive Officer",
                "department": departments[0],
                "profile_image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                "hire_date": date.today() - timedelta(days=1200),
                "status": Employee.Status.ACTIVE,
            },
        )

        leadership = [
            ("Nikos", "Papadopoulos", "Chief Technology Officer", departments[1]),
            ("Sofia", "Markou", "HR Director", departments[2]),
            ("Petros", "Iliadis", "Finance Director", departments[3]),
            ("Marina", "Vlachou", "Sales Director", departments[4]),
        ]

        managers = []
        for idx, (first_name, last_name, job_title, department) in enumerate(leadership, start=2):
            manager, _ = Employee.objects.get_or_create(
                email=f"{first_name.lower()}.{last_name.lower()}@orgflow.local",
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone": f"+30 210 000000{idx}",
                    "job_title": job_title,
                    "department": department,
                    "manager": ceo,
                    "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                    "hire_date": date.today() - timedelta(days=900 - idx * 10),
                    "status": Employee.Status.ACTIVE,
                },
            )
            managers.append(manager)

        staff_templates = [
            ("Anna", "Georgiou", "Frontend Engineer", departments[1]),
            ("Dimitris", "Kostas", "Backend Engineer", departments[1]),
            ("Irene", "Lazarou", "Recruiter", departments[2]),
            ("Giorgos", "Mellis", "Payroll Specialist", departments[3]),
            ("Katerina", "Fotiou", "Account Executive", departments[4]),
            ("Alex", "Nikolou", "QA Analyst", departments[1]),
            ("Maria", "Spiliou", "People Operations Specialist", departments[2]),
            ("Thanasis", "Bellos", "Financial Analyst", departments[3]),
        ]

        statuses = [Employee.Status.ACTIVE, Employee.Status.ACTIVE, Employee.Status.ON_LEAVE]
        for idx, (first_name, last_name, job_title, department) in enumerate(staff_templates, start=10):
            direct_manager = next((item for item in managers if item.department_id == department.id), ceo)
            Employee.objects.get_or_create(
                email=f"{first_name.lower()}.{last_name.lower()}@orgflow.local",
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone": f"+30 210 10000{idx}",
                    "job_title": job_title,
                    "department": department,
                    "manager": direct_manager,
                    "profile_image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
                    "hire_date": date.today() - timedelta(days=random.randint(40, 700)),
                    "status": random.choice(statuses),
                },
            )

        self.stdout.write(self.style.SUCCESS("Demo data created."))
        self.stdout.write("Admin login: admin / Admin12345!")
        self.stdout.write("Viewer login: viewer / Viewer12345!")
