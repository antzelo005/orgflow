import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../features/auth/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "viewer" as "admin" | "viewer",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login");
    } catch {
      toast.error("Registration failed. Check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <span className="eyebrow">New Account</span>
        <h1>Create secure platform access</h1>
        <p>Register an administrator or viewer account for local project demos.</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Username
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
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
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as "admin" | "viewer" })}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="primary-button" disabled={submitting}>
          {submitting ? "Creating..." : "Create Account"}
        </button>
        <p className="auth-footnote">
          Already registered? <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
