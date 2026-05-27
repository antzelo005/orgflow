import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { downloadBlob } from "../api/download";
import { Department } from "../api/types";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../features/auth/AuthContext";
import { deleteDepartment, exportDepartmentsCsv, listDepartments, saveDepartment } from "../features/departments/departmentsApi";

const initialForm = { name: "", description: "", location: "", open_positions: 0 };

export function DepartmentsPage() {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadDepartments = async () => {
    const data = await listDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    void loadDepartments().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (department: Department) => {
    setEditing(department);
    setForm({
      name: department.name,
      description: department.description,
      location: department.location,
      open_positions: department.open_positions,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await saveDepartment({ id: editing?.id, ...form });
      toast.success(editing ? "Department updated." : "Department created.");
      setModalOpen(false);
      await loadDepartments();
    } catch {
      toast.error("Unable to save department.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      toast.success("Department removed.");
      await loadDepartments();
    } catch {
      toast.error("Unable to delete department.");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportDepartmentsCsv();
      downloadBlob(blob, "departments.csv");
      toast.success("Departments exported.");
    } catch {
      toast.error("Unable to export departments.");
    }
  };

  if (loading) {
    return <LoadingScreen label="Loading departments..." />;
  }

  return (
    <section className="page-section">
      <PageHeader
        title="Departments"
        description="Manage business units, office locations, and core descriptions."
        action={
          <div className="page-actions">
            <button className="ghost-button" onClick={() => void handleExport()}>
              Export CSV
            </button>
            {isAdmin && (
              <button className="primary-button" onClick={openCreate}>
                New Department
              </button>
            )}
          </div>
        }
      />

      {departments.length === 0 ? (
        <EmptyState title="No departments found" description="Create the first department to organize employees." />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Open Positions</th>
                <th>Employees</th>
                {isAdmin && <th />}
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.description}</td>
                  <td>{department.location}</td>
                  <td>{department.open_positions}</td>
                  <td>{department.employee_count ?? 0}</td>
                  {isAdmin && (
                    <td className="table-actions">
                      <button className="ghost-button" onClick={() => openEdit(department)}>Edit</button>
                      <button className="danger-button" onClick={() => void handleDelete(department.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title={editing ? "Edit Department" : "Create Department"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
          </label>
          <label>
            Open positions
            <input
              type="number"
              min={0}
              value={form.open_positions}
              onChange={(event) => setForm({ ...form, open_positions: Number(event.target.value) })}
            />
          </label>
          <button className="primary-button">{editing ? "Save Changes" : "Create Department"}</button>
        </form>
      </Modal>
    </section>
  );
}
