export type UserRole = "admin" | "viewer";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  location: string;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  department: number;
  department_name: string;
  manager: number | null;
  manager_name: string | null;
  profile_image_url: string;
  hire_date: string;
  status: "active" | "on_leave" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  total_employees: number;
  total_departments: number;
  employees_per_department: Array<{ name: string; value: number }>;
  recent_employees: Employee[];
}

export interface OrgNode {
  id: number;
  full_name: string;
  job_title: string;
  department_name: string;
  email: string;
  status: string;
  profile_image_url: string;
  reports: OrgNode[];
}
