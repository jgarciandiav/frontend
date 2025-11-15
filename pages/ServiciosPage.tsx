import React, { useEffect, useState } from "react"
import { api } from "../src/api"

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([])
  const [nombre, setNombre] = useState("")

  const fetch = () => api.get("/servicios").then(r => setServicios(r.data))
  useEffect(() => { fetch() }, [])

  const agregar = () => {
    api.post("/servicios", { service: nombre }).then(() => {
      setNombre("")
      fetch()
    })
  }

  const eliminar = (id: number) => {
    api.delete(`/servicios/${id}`).then(fetch)
  }

  return (
    <div className="container mt-4">
      <h2>Servicios</h2>
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col">
            <input className="form-control" placeholder="Nuevo servicio" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={agregar}>Agregar</button>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr><th>ID</th><th>Servicio</th><th></th></tr>
          </thead>
          <tbody>
            {servicios.map((s: any) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.service}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminar(s.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}