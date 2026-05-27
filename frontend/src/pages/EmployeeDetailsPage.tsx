import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Employee } from "../api/types";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { PageHeader } from "../components/ui/PageHeader";
import { getEmployee } from "../features/employees/employeesApi";

export function EmployeeDetailsPage() {
  const { employeeId = "" } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getEmployee(employeeId)
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) {
    return <LoadingScreen label="Loading employee profile..." />;
  }

  if (!employee) {
    return <EmptyState title="Employee not found" description="The selected employee could not be loaded." />;
  }

  return (
    <section className="page-section">
      <PageHeader title={employee.full_name} description="Employee profile and reporting information." />
      <div className="profile-card large">
        <img
          src={employee.profile_image_url || "https://via.placeholder.com/120x120?text=User"}
          alt={employee.full_name}
          className="avatar-xl"
        />
        <div className="details-grid">
          <div>
            <span>Job title</span>
            <strong>{employee.job_title}</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{employee.department_name}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{employee.email}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{employee.phone || "Not provided"}</strong>
          </div>
          <div>
            <span>Manager</span>
            <strong>{employee.manager_name ?? "Top-level employee"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{employee.status.replace("_", " ")}</strong>
          </div>
          <div>
            <span>Hire date</span>
            <strong>{employee.hire_date}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
