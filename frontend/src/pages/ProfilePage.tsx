import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../features/auth/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="page-section">
      <PageHeader title="Profile" description="Current user account and access level." />
      <div className="profile-card">
        <div className="details-grid">
          <div>
            <span>Username</span>
            <strong>{user?.username}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div>
            <span>Name</span>
            <strong>
              {user?.first_name} {user?.last_name}
            </strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
