import { Building2, GitBranchPlus, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/org-chart", label: "Org Chart", icon: GitBranchPlus },
  { to: "/profile", label: "Profile", icon: Settings },
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand-card">
            <span className="brand-kicker">Theme 17</span>
            <h1>OrgFlow</h1>
            <p>Corporate structure management dashboard.</p>
          </div>

          <nav className="nav-list">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="profile-summary">
            <strong>{user?.first_name || user?.username}</strong>
            <span>{user?.role === "admin" ? "Administrator" : "Viewer"}</span>
          </div>
          <button className="ghost-button full-width" onClick={logout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
