import { api } from "../../api/client";
import { OrgNode } from "../../api/types";

export async function getOrgChart() {
  const response = await api.get<OrgNode[]>("/org-chart/");
  return response.data;
}
