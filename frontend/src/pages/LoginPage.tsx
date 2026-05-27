import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../features/auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <span className="eyebrow">OrgFlow Access</span>
        <h1>Sign in to your dashboard</h1>
        <p>Manage departments, employees, and company hierarchy from one place.</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Username
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <button className="primary-button" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
        <p className="auth-footnote">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
