import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";
import { FiUser, FiMail, FiLock, FiUserPlus, FiArrowLeft } from "react-icons/fi";
import "../src/styles/dashboard.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });
  const nav = useNavigate();

  const handle = async () => {
    await api.post("/users/register", { ...form, is_active: true });
    nav("/login");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card" style={{ maxWidth: "480px" }}>
        <div className="auth-logo" style={{ backgroundColor: "var(--success-green)", boxShadow: "0 10px 20px rgba(25, 135, 84, 0.2)" }}>
          <FiUserPlus />
        </div>

        <div className="text-center mb-5">
          <h2 className="fw-bold mb-1">Crear Cuenta</h2>
          <p className="text-muted">Únete a FactuFlow para gestionar tus facturas</p>
        </div>

        <div className="auth-body">
          <div className="auth-input-group">
            <input
              className="form-control"
              placeholder="Nombre de usuario"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <div className="auth-icon">
              <FiUser />
            </div>
          </div>

          <div className="auth-input-group">
            <input
              className="form-control"
              placeholder="Nombre completo"
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <div className="auth-icon">
              <FiUser />
            </div>
          </div>

          <div className="auth-input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="auth-icon">
              <FiMail />
            </div>
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="auth-icon">
              <FiLock />
            </div>
          </div>

          <button className="btn-modern btn-modern-success w-100 justify-content-center mt-3" onClick={handle} style={{ height: "54px" }}>
            Registrarse
          </button>

          <div className="text-center mt-4">
            <button className="btn btn-link p-0 small fw-bold text-decoration-none text-muted d-flex align-items-center justify-content-center mx-auto" onClick={() => nav("/login")}>
              <FiArrowLeft className="me-2" /> Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}