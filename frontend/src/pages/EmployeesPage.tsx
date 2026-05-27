import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Department, Employee } from "../api/types";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../features/auth/AuthContext";
import { listDepartments } from "../features/departments/departmentsApi";
import { deleteEmployee, listEmployees, saveEmployee } from "../features/employees/employeesApi";

const initialEmployee = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  job_title: "",
  department: "",
  manager: "",
  profile_image_url: "",
  hire_date: "",
  status: "active",
};

export function EmployeesPage() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [filters, setFilters] = useState({ search: "", department: "", status: "" });
  const [form, setForm] = useState(initialEmployee);

  const loadData = async () => {
    const [employeeData, departmentData] = await Promise.all([listEmployees(filters), listDepartments()]);
    setEmployees(employeeData);
    setDepartments(departmentData);
  };

  useEffect(() => {
    void loadData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      void loadData();
    }
  }, [filters.search, filters.department, filters.status]);

  const managerOptions = employees.filter((employee) => employee.id !== editing?.id);

  const openCreate = () => {
    setEditing(null);
    setForm(initialEmployee);
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      job_title: employee.job_title,
      department: String(employee.department),
      manager: employee.manager ? String(employee.manager) : "",
      profile_image_url: employee.profile_image_url,
      hire_date: employee.hire_date,
      status: employee.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await saveEmployee({
        id: editing?.id,
        ...form,
        department: Number(form.department),
        manager: form.manager ? Number(form.manager) : null,
      });
      toast.success(editing ? "Employee updated." : "Employee created.");
      setModalOpen(false);
      await loadData();
    } catch {
      toast.error("Unable to save employee.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      toast.success("Employee removed.");
      await loadData();
    } catch {
      toast.error("Unable to delete employee.");
    }
  };

  if (loading) {
    return <LoadingScreen label="Loading employees..." />;
  }

  return (
    <section className="page-section">
      <PageHeader
        title="Employees"
        description="Search people, manage assignments, and keep reporting lines current."
        action={isAdmin ? <button className="primary-button" onClick={openCreate}>New Employee</button> : undefined}
      />

      <div className="filters-card">
        <input
          placeholder="Search by name, email, or title"
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />
        <select value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })}>
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {employees.length === 0 ? (
        <EmptyState title="No employees match the current filters" description="Adjust search filters or add a new employee." />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Job title</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <Link className="table-link" to={`/employees/${employee.id}`}>
                      {employee.full_name}
                    </Link>
                    <span className="table-subtext">{employee.email}</span>
                  </td>
                  <td>{employee.job_title}</td>
                  <td>{employee.department_name}</td>
                  <td>{employee.manager_name ?? "Top-level"}</td>
                  <td>
                    <span className={`status-pill ${employee.status}`}>{employee.status.replace("_", " ")}</span>
                  </td>
                  <td className="table-actions">
                    {isAdmin && <button className="ghost-button" onClick={() => openEdit(employee)}>Edit</button>}
                    {isAdmin && <button className="danger-button" onClick={() => void handleDelete(employee.id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title={editing ? "Edit Employee" : "Create Employee"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="grid-two">
            <label>
              First name
              <input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} required />
            </label>
            <label>
              Last name
              <input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} required />
            </label>
          </div>
          <div className="grid-two">
            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
          </div>
          <label>
            Job title
            <input value={form.job_title} onChange={(event) => setForm({ ...form, job_title: event.target.value })} required />
          </label>
          <div className="grid-two">
            <label>
              Department
              <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required>
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Manager
              <select value={form.manager} onChange={(event) => setForm({ ...form, manager: event.target.value })}>
                <option value="">Top-level / CEO</option>
                {managerOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid-two">
            <label>
              Hire date
              <input type="date" value={form.hire_date} onChange={(event) => setForm({ ...form, hire_date: event.target.value })} required />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <label>
            Profile image URL
            <input value={form.profile_image_url} onChange={(event) => setForm({ ...form, profile_image_url: event.target.value })} />
          </label>
          <button className="primary-button">{editing ? "Save Changes" : "Create Employee"}</button>
        </form>
      </Modal>
    </section>
  );
}
