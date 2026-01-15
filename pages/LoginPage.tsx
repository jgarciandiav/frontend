import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";
import "../src/styles/dashboard.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const nav = useNavigate();

  const handle = async () => {
    await api.post("/users/login", form);
    nav("/dashboard");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <FiLogIn />
        </div>

        <div className="text-center mb-5">
          <h2 className="fw-bold mb-1">Bienvenido</h2>
          <p className="text-muted">Ingresa tus credenciales para continuar</p>
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
              type="password"
              className="form-control"
              placeholder="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="auth-icon">
              <FiLock />
            </div>
          </div>

          <button className="btn-modern btn-modern-primary w-100 justify-content-center mt-3" onClick={handle} style={{ height: "54px" }}>
            Iniciar Sesión
          </button>

          <div className="text-center mt-4">
            <span className="text-muted small">¿No tienes una cuenta?</span>
            <button className="btn btn-link p-0 ms-2 small fw-bold text-decoration-none" onClick={() => nav("/register")}>
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}