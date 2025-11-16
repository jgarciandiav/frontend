import React, { useState, useEffect } from "react"
import { api } from "../src/api"

export default function FacturaFormPage() {
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState<string[]>([])
  const [direccionAuto, setDireccionAuto] = useState("")

  const [form, setForm] = useState({
    nofactura: "",
    fecha: new Date().toISOString().substr(0, 10),
    customer: "",
    address: "",
    cobrado: false,
    items: [] as { service: string; importe: number }[],
  })

  // Carga maestros
  useEffect(() => {
    api.get("/clientes").then(r => setClientes(r.data))
    api.get("/servicios").then(r => setServicios(r.data.map((s: any) => s.service)))
  }, [])

  // 🔍 AUTO-BÚSQUEDA DE DIRECCIÓN
  useEffect(() => {
    if (!form.customer) {
      setDireccionAuto("")
      return
    }
    const nombreLimpio = form.customer.trim().toLowerCase()
    api
      .get(`/clientes/buscar?nombre=${encodeURIComponent(nombreLimpio)}`)
      .then(r => setDireccionAuto(r.data.address))
      .catch(() => setDireccionAuto("")) // cliente no existe → vacío
  }, [form.customer])

  const addItem = () => setForm({ ...form, items: [...form.items, { service: "", importe: 0 }] })
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const guardar = () => api.post("/facturas", form).then(() => {
    alert("Factura creada")
    window.location.href = "/dashboard"
  })

  return (
    <div className="container mt-4">
      <h2>Nueva Factura</h2>

      {/* CABECERA */}
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-2"><label className="form-label">No.</label><input className="form-control" value={form.nofactura} onChange={e => setForm({ ...form, nofactura: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Fecha</label><input type="date" className="form-control" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
          <div className="col-md-5"><label className="form-label">Cliente</label><input list="clientes-list" className="form-control" placeholder="Escriba o seleccione cliente" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} /><datalist id="clientes-list">{clientes.map((c: any) => (<option key={c.id} value={c.name} />))}</datalist></div>
          <div className="col-md-2"><label className="form-label">Cobrado</label><select className="form-select" value={form.cobrado ? "1" : "0"} onChange={e => setForm({ ...form, cobrado: e.target.value === "1" })}><option value="0">No</option><option value="1">Sí</option></select></div>
        </div>
        <div className="row g-2 mt-2"><div className="col"><label className="form-label">Dirección</label><input className="form-control" value={form.address || direccionAuto} onChange={e => setForm({ ...form, address: e.target.value })} /></div></div>
      </div>

      {/* ITEMS */}
      <h5>Items</h5>
      {form.items.map((it, idx) => (
        <div className="row g-2 mb-2" key={idx}>
          <div className="col-5"><input list="servicios-list" className="form-control" placeholder="Escriba o seleccione servicio" value={it.service} onChange={e => { const n = [...form.items]; n[idx].service = e.target.value; setForm({ ...form, items: n })}} /><datalist id="servicios-list">{servicios.map(s => (<option key={s} value={s} />))}</datalist></div>
          <div className="col-4"><input type="number" step="0.01" className="form-control" placeholder="Importe" value={it.importe} onChange={e => { const n = [...form.items]; n[idx].importe = parseFloat(e.target.value) || 0; setForm({ ...form, items: n })}} /></div>
          <div className="col-3 d-flex align-items-center"><button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(idx)}>Quitar</button></div>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-3"><button className="btn btn-outline-primary" onClick={addItem}>+ Agregar item</button><button className="btn btn-success" onClick={guardar}>Guardar Factura</button></div>
    </div>
  )
}