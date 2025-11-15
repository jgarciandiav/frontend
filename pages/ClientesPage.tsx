import React, { useEffect, useState } from "react"
import { api } from "../src/api"

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({ name: "", address: "" })

  const fetch = () => api.get("/clientes").then(r => setClientes(r.data))
  useEffect(() => { fetch() }, [])

  const agregar = () => {
    api.post("/clientes", form).then(() => {
      setForm({ name: "", address: "" })
      fetch()
    })
  }

  const eliminar = (id: number) => api.delete(`/clientes/${id}`).then(fetch)

  return (
    <div className="container mt-4">
      <h2>Clientes</h2>
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="col"><input className="form-control" placeholder="Dirección" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          <div className="col-auto"><button className="btn btn-primary" onClick={agregar}>Agregar</button></div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark"><tr><th>ID</th><th>Nombre</th><th>Dirección</th><th></th></tr></thead>
          <tbody>
            {clientes.map((c: any) => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.name}</td><td>{c.address}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => eliminar(c.id)}>Borrar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}