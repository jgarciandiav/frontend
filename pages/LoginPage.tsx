import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../src/api"

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" })
  const nav = useNavigate()

  const handle = async () => {
    await api.post("/users/login", form)
    nav("/dashboard")
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow" style={{ width: "22rem" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Iniciar Sesión</h4>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              className="form-control"
              placeholder="Usuario"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="btn btn-primary w-100" onClick={handle}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}