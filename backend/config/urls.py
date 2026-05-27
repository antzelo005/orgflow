from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import CurrentUserView, RegisterView, TokenObtainPairWithRoleView
from apps.organization.views import DashboardView, DepartmentViewSet, EmployeeViewSet, OrganizationTreeView

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")
router.register("employees", EmployeeViewSet, basename="employee")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairWithRoleView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/dashboard/", DashboardView.as_view(), name="dashboard"),
    path("api/org-chart/", OrganizationTreeView.as_view(), name="org_chart"),
    path("api/", include(router.urls)),
]
