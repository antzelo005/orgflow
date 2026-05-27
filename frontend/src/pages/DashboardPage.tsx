import { useEffect, useState } from "react";

import { DashboardMetrics } from "../api/types";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { PageHeader } from "../components/ui/PageHeader";
import { getDashboardMetrics } from "../features/dashboard/dashboardApi";

export function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getDashboardMetrics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen label="Loading dashboard..." />;
  }

  if (!data) {
    return <EmptyState title="No dashboard data" description="Seed demo data or add departments and employees to populate this page." />;
  }

  return (
    <section className="page-section">
      <PageHeader title="Dashboard" description="Live overview of departments, workforce size, recent additions, and open roles." />

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total employees</span>
          <strong>{data.total_employees}</strong>
        </div>
        <div className="stat-card">
          <span>Total departments</span>
          <strong>{data.total_departments}</strong>
        </div>
        <div className="stat-card">
          <span>Open positions</span>
          <strong>{data.total_open_positions}</strong>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel-card">
          <div className="panel-head">
            <h3>Employees per department</h3>
          </div>
          <div className="bar-list">
            {data.employees_per_department.map((item) => (
              <div key={item.name}>
                <div className="bar-label">
                  <span>{item.name}</span>
                  <strong>{item.value} employees / {item.open_positions} open</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.max(item.value * 12, 10)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-head">
            <h3>Recently added employees</h3>
          </div>
          {data.recent_employees.length === 0 ? (
            <EmptyState title="No employees yet" description="Create the first employee to see activity here." />
          ) : (
            <div className="list-stack">
              {data.recent_employees.map((employee) => (
                <div className="list-item" key={employee.id}>
                  <div>
                    <strong>{employee.full_name}</strong>
                    <p>
                      {employee.job_title} | {employee.department_name}
                    </p>
                  </div>
                  <span className={`status-pill ${employee.status}`}>{employee.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
