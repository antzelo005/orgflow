from django.db.models import Count, Q
from rest_framework import generics, viewsets
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


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = Employee.objects.select_related("department", "manager").all()
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


class DashboardView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        employees_per_department = list(
            Department.objects.annotate(value=Count("employees"))
            .values("name", "value")
            .order_by("-value", "name")
        )
        recent_employees = Employee.objects.select_related("department", "manager").order_by("-created_at")[:5]

        return Response(
            {
                "total_employees": Employee.objects.count(),
                "total_departments": Department.objects.count(),
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
