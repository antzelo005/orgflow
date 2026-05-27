import { api } from "../../api/client";
import { Department } from "../../api/types";

export async function listDepartments() {
  const response = await api.get<Department[]>("/departments/");
  return response.data;
}

export async function saveDepartment(payload: Partial<Department>) {
  if (payload.id) {
    const response = await api.put<Department>(`/departments/${payload.id}/`, payload);
    return response.data;
  }
  const response = await api.post<Department>("/departments/", payload);
  return response.data;
}

export async function deleteDepartment(id: number) {
  await api.delete(`/departments/${id}/`);
}

export async function exportDepartmentsCsv() {
  const response = await api.get("/departments/export/", { responseType: "blob" });
  return response.data as Blob;
}
