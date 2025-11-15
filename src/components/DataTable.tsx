import React, { useEffect, useState } from "react"
import { api } from "../api"
import { useNavigate } from "react-router-dom"

export default function DataTable() {
  const [facturas, setFacturas] = useState([])

  useEffect(() => {
    api.get("/facturas").then((res) => setFacturas(res.data))
  }, [])
  const nav = useNavigate()
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>No. Factura</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Cobrado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f: any) => (
            <tr key={f.nofactura}>
              <td>{f.nofactura}</td>
              <td>{f.customer}</td>
              <td>${f.total}</td>
              <td>{f.cobrado ? "Sí" : "No"}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2">Imprimir</button>
                <button className="btn btn-sm btn-warning me-2"
                    onClick={() => nav(`/facturas/editar/${f.nofactura}`)}>
                      Editar
                </button>
                <button className="btn btn-sm btn-danger">Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}