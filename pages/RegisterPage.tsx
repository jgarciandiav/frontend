import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../src/api"

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  })
  const nav = useNavigate()

  const handle = async () => {
    await api.post("/users/register", { ...form, is_active: true })
    nav("/login")
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow" style={{ width: "24rem" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Crear Usuario</h4>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input className="form-control" placeholder="Usuario" onChange={e => setForm({...form, username: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input className="form-control" placeholder="Nombre completo" onChange={e => setForm({...form, full_name: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" placeholder="Contraseña" onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button className="btn btn-success w-100" onClick={handle}>Registrar</button>
        </div>
      </div>
    </div>
  )
}