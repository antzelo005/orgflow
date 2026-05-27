import { api } from "../../api/client";
import { DashboardMetrics } from "../../api/types";

export async function getDashboardMetrics() {
  const response = await api.get<DashboardMetrics>("/dashboard/");
  return response.data;
}
