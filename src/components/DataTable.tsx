import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // ✅ agregado
import { api } from "../api"
import { ImprimirFactura } from "../components/ImprimirFactura"

export default function Dashboard() {
  const [facturas, setFacturas] = useState<any[]>([])
  const [resumen, setResumen] = useState({ total: 0, cobradas: 0, sin_cobrar: 0 })
  const [itemsMap, setItemsMap] = useState<Record<string, any[]>>({})

  const navigate = useNavigate() // ✅ agregado

  // Carga inicial
  useEffect(() => {
    api.get("/facturas").then(r => setFacturas(r.data))
    api.get("/facturas/resumen").then(r => setResumen(r.data))
  }, [])

  // Imprimir: carga items y renderiza componente
  const handlePrint = (nofactura: string) => {
    api
      .get(`/facturaitems?nofactura=${encodeURIComponent(nofactura)}`)
      .then(r => setItemsMap(prev => ({ ...prev, [nofactura]: r.data })))
      .catch(() => setItemsMap(prev => ({ ...prev, [nofactura]: [] })))
  }

  // Borrar: ✅ agregado
  const handleDelete = (nofactura: string) => {
    if (!confirm("¿Borrar esta factura?")) return
    api.delete(`/facturas/${nofactura}`).then(() => {
      setFacturas(prev => prev.filter(f => f.nofactura !== nofactura))
      setItemsMap(prev => {
        const copy = { ...prev }
        delete copy[nofactura]
        return copy
      })
    })
  }

  return (
    <div className="container mt-4">
      {/* Tarjetas de resumen */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Facturas</h5>
              <h2>{resumen.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Cobradas</h5>
              <h2>{resumen.cobradas}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Sin Cobrar</h5>
              <h2>{resumen.sin_cobrar}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>No. Factura</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Cobrado</th>
              <th style={{ minWidth: 220, whiteSpace: "nowrap" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f.nofactura}>
                <td>{f.nofactura}</td>
                <td>{f.customer}</td>
                <td>${f.total}</td>
                <td>{f.cobrado ? "Sí" : "No"}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/facturas/editar/${f.nofactura}`)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handlePrint(f.nofactura)}>
                    📄 Imprimir
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f.nofactura)}>
                    Borrar
                  </button>
                  {/* Renderiza ImprimirFactura solo cuando tengamos items */}
                  {itemsMap[f.nofactura] && <ImprimirFactura factura={f} items={itemsMap[f.nofactura]} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}