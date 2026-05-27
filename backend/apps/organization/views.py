import csv
from datetime import date
from io import StringIO

from django.db import transaction
from django.db.models import Count, Prefetch, Q, Sum
from django.http import HttpResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Department, Employee
from .permissions import IsAdminOrReadOnly
from .serializers import DepartmentSerializer, EmployeeSerializer, OrganizationNodeSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        return Department.objects.annotate(employee_count=Count("employees")).order_by("name")

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        departments = self.get_queryset()
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="departments.csv"'
        writer = csv.writer(response)
        writer.writerow(["id", "name", "description", "location", "open_positions", "employee_count"])
        for department in departments:
            writer.writerow(
                [
                    department.id,
                    department.name,
                    department.description,
                    department.location,
                    department.open_positions,
                    department.employee_count,
                ]
            )
        return response


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = (
            Employee.objects.select_related("department", "manager")
            .annotate(subordinate_count=Count("subordinates", distinct=True))
            .prefetch_related(
                Prefetch(
                    "subordinates",
                    queryset=Employee.objects.only(
                        "id",
                        "first_name",
                        "last_name",
                        "job_title",
                        "email",
                        "status",
                        "manager_id",
                    ).order_by("first_name", "last_name"),
                    to_attr="prefetched_direct_reports",
                )
            )
        )
        search = self.request.query_params.get("search")
        department_id = self.request.query_params.get("department")
        status_value = self.request.query_params.get("status")

        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(email__icontains=search)
                | Q(job_title__icontains=search)
            )
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return queryset.order_by("first_name", "last_name")

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        employees = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="employees.csv"'
        writer = csv.writer(response)
        writer.writerow(
            [
                "id",
                "first_name",
                "last_name",
                "email",
                "phone",
                "job_title",
                "department",
                "manager_email",
                "hire_date",
                "status",
                "profile_image_url",
                "subordinate_count",
            ]
        )
        for employee in employees:
            writer.writerow(
                [
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    employee.email,
                    employee.phone,
                    employee.job_title,
                    employee.department.name,
                    employee.manager.email if employee.manager_id else "",
                    employee.hire_date.isoformat(),
                    employee.status,
                    employee.profile_image_url,
                    employee.subordinate_count,
                ]
            )
        return response

    @action(detail=False, methods=["post"], url_path="import-csv", parser_classes=[MultiPartParser])
    def import_csv(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "CSV file is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            content = upload.read().decode("utf-8-sig")
        except UnicodeDecodeError:
            return Response({"detail": "Unable to decode the uploaded file as UTF-8 CSV."}, status=status.HTTP_400_BAD_REQUEST)

        reader = csv.DictReader(StringIO(content))
        required_columns = {"first_name", "last_name", "email", "job_title", "department", "hire_date"}
        if not reader.fieldnames or not required_columns.issubset(set(reader.fieldnames)):
            return Response(
                {
                    "detail": "Invalid CSV header.",
                    "required_columns": sorted(required_columns),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        rows = list(reader)
        if not rows:
            return Response({"detail": "The uploaded CSV file is empty."}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        prepared_rows = []
        seen_emails = set()
        departments_by_name = {department.name.lower(): department for department in Department.objects.all()}
        managers_by_email = {employee.email.lower(): employee for employee in Employee.objects.all()}

        for index, row in enumerate(rows, start=2):
            department_name = (row.get("department") or "").strip()
            department = departments_by_name.get(department_name.lower())
            if not department:
                errors.append(f"Row {index}: Department '{department_name}' does not exist.")
                continue

            manager_email = (row.get("manager_email") or "").strip().lower()
            manager = None
            if manager_email:
                manager = managers_by_email.get(manager_email)
                if manager is None:
                    errors.append(f"Row {index}: Manager '{manager_email}' was not found.")
                    continue

            try:
                hire_date = date.fromisoformat((row.get("hire_date") or "").strip())
            except ValueError:
                errors.append(f"Row {index}: hire_date must use YYYY-MM-DD format.")
                continue

            status_value = (row.get("status") or Employee.Status.ACTIVE).strip() or Employee.Status.ACTIVE
            valid_statuses = {choice for choice, _ in Employee.Status.choices}
            if status_value not in valid_statuses:
                errors.append(f"Row {index}: status '{status_value}' is invalid.")
                continue

            email = (row.get("email") or "").strip()
            if email.lower() in seen_emails:
                errors.append(f"Row {index}: Employee email '{email}' appears more than once in the file.")
                continue
            if Employee.objects.filter(email=email).exists():
                errors.append(f"Row {index}: Employee email '{email}' already exists.")
                continue
            seen_emails.add(email.lower())

            prepared_rows.append(
                {
                    "first_name": (row.get("first_name") or "").strip(),
                    "last_name": (row.get("last_name") or "").strip(),
                    "email": email,
                    "phone": (row.get("phone") or "").strip(),
                    "job_title": (row.get("job_title") or "").strip(),
                    "department": department,
                    "manager": manager,
                    "profile_image_url": (row.get("profile_image_url") or "").strip(),
                    "hire_date": hire_date,
                    "status": status_value,
                }
            )

        if errors:
            return Response({"detail": "CSV import failed.", "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        created_count = 0
        with transaction.atomic():
            for payload in prepared_rows:
                Employee.objects.create(**payload)
                created_count += 1

        return Response({"detail": f"Imported {created_count} employees successfully."}, status=status.HTTP_201_CREATED)


class DashboardView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        department_metrics = Department.objects.annotate(value=Count("employees")).order_by("-value", "name")
        employees_per_department = list(
            department_metrics.values("name", "value", "open_positions")
            .order_by("-value", "name")
        )
        recent_employees = Employee.objects.select_related("department", "manager").order_by("-created_at")[:5]

        return Response(
            {
                "total_employees": Employee.objects.count(),
                "total_departments": Department.objects.count(),
                "total_open_positions": Department.objects.aggregate(total=Sum("open_positions"))["total"] or 0,
                "employees_per_department": employees_per_department,
                "recent_employees": EmployeeSerializer(recent_employees, many=True).data,
            }
        )


class OrganizationTreeView(generics.GenericAPIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        employees = list(
            Employee.objects.select_related("department", "manager")
            .all()
            .order_by("first_name", "last_name")
        )
        reports_by_manager = {}
        roots = []

        for employee in employees:
            if employee.manager_id is None:
                roots.append(employee)
            else:
                reports_by_manager.setdefault(employee.manager_id, []).append(employee)

        serializer = OrganizationNodeSerializer(
            roots,
            many=True,
            context={"reports_by_manager": reports_by_manager},
        )
        return Response(serializer.data)
