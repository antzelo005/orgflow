from rest_framework import serializers

from .models import Department, Employee


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = ("id", "name", "description", "location", "employee_count", "created_at", "updated_at")


class EmployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="department.name", read_only=True)
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
            "job_title",
            "department",
            "department_name",
            "manager",
            "manager_name",
            "profile_image_url",
            "hire_date",
            "status",
            "created_at",
            "updated_at",
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_manager_name(self, obj):
        if obj.manager_id:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None

    def validate_manager(self, value):
        employee = self.instance
        if employee and value and employee.id == value.id:
            raise serializers.ValidationError("An employee cannot manage themselves.")
        return value


class OrganizationNodeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="department.name", read_only=True)
    reports = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = (
            "id",
            "full_name",
            "job_title",
            "department_name",
            "email",
            "status",
            "profile_image_url",
            "reports",
        )

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_reports(self, obj):
        return OrganizationNodeSerializer(
            obj.subordinates.select_related("department").all(),
            many=True,
        ).data
