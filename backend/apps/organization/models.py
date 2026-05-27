from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    open_positions = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class Employee(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ON_LEAVE = "on_leave", "On Leave"
        INACTIVE = "inactive", "Inactive"

    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True)
    job_title = models.CharField(max_length=120)
    department = models.ForeignKey(Department, related_name="employees", on_delete=models.CASCADE)
    manager = models.ForeignKey(
        "self",
        related_name="subordinates",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    profile_image_url = models.URLField(blank=True)
    hire_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("first_name", "last_name")

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
