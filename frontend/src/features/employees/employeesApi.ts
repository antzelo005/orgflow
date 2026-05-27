import { api } from "../../api/client";
import { Employee } from "../../api/types";

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
}

export async function listEmployees(filters: EmployeeFilters = {}) {
  const response = await api.get<Employee[]>("/employees/", { params: filters });
  return response.data;
}

export async function getEmployee(id: string) {
  const response = await api.get<Employee>(`/employees/${id}/`);
  return response.data;
}

export async function saveEmployee(payload: Partial<Employee>) {
  if (payload.id) {
    const response = await api.put<Employee>(`/employees/${payload.id}/`, payload);
    return response.data;
  }
  const response = await api.post<Employee>("/employees/", payload);
  return response.data;
}

export async function deleteEmployee(id: number) {
  await api.delete(`/employees/${id}/`);
}

export async function exportEmployeesCsv(filters: EmployeeFilters = {}) {
  const response = await api.get("/employees/export/", {
    params: filters,
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function importEmployeesCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/employees/import-csv/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as { detail: string; errors?: string[] };
}
