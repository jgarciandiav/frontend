import React, { useState, useEffect } from "react"
import { useNavigate,useParams } from "react-router-dom"  // ← IMPORTA AQUÍ
import { api } from "../src/api"
import { ImprimirFactura } from "../src/components/ImprimirFactura"

export default function FacturaEditPage() {
  const { nofactura } = useParams() as { nofactura: string }
  const navigate = useNavigate()  // ← USO AQUÍ

  const [clientes, setClientes] = useState<any[]>([])
  const [servicios, setServicios] = useState<string[]>([])
  const [items, setItems] = useState<any[]>([])

  const [form, setForm] = useState({
    nofactura: "",
    fecha: "",
    customer: "",
    address: "",
    cobrado: false,
    items: [] as { service: string; importe: number }[],
  })

  // Carga maestros + factura
  useEffect(() => {
    api.get("/clientes").then(r => setClientes(r.data))
    api.get("/servicios").then(r => setServicios(r.data.map((s: any) => s.service)))

    api.get(`/facturas/${nofactura}`).then(r => {
      setForm({
        nofactura: r.data.nofactura,
        fecha: r.data.fecha,
        customer: r.data.customer,
        address: r.data.address,
        cobrado: r.data.cobrado,
        items: [],
      })
      return api.get(`/facturaitems?nofactura=${nofactura}`)
    }).then(r => {
      setForm(f => ({ ...f, items: r.data }))
      setItems(r.data)
    })
  }, [nofactura])

  // Autocompletado de dirección
  useEffect(() => {
    if (!form.customer) return
    const nombreLimpio = form.customer.trim().toLowerCase()
    api
      .get(`/clientes/buscar?nombre=${encodeURIComponent(nombreLimpio)}`)
      .then(r => setForm(f => ({ ...f, address: r.data.address })))
      .catch(() => {/* cliente no existe → deja campo vacío */})
  }, [form.customer])

  const addItem = () => setForm({ ...form, items: [...form.items, { service: "", importe: 0 }] })
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })

  const guardar = async () => {
    // 1. Validación mínima
    if (!form.nofactura || !form.customer || form.items.length === 0) {
      alert("Complete todos los campos y al menos un item")
      return
    }

    // 2. Limpia items vacíos
    const itemsLimpios = form.items.filter(it => it.service.trim() !== "")

    // 3. Calcula total
    const total = itemsLimpios.reduce((sum, it) => sum + (Number(it.importe) || 0), 0)

    // 4. Enviar MAESTRO + DETALLE
    const payload = {
      nofactura: form.nofactura,
      fecha: form.fecha,
      customer: form.customer,
      address: form.address,
      cobrado: form.cobrado,
      items: itemsLimpios,
      total: total
    }

    console.log("📎 Enviando:", payload)

    await api.put(`/facturas/${form.nofactura}`, payload).then(() => {
      alert("Factura actualizada")
      navigate("/dashboard")  // ← USO DE navigate
    }).catch(err => {
      console.error("❌ Error al actualizar:", err)
      alert("Error al actualizar")
    })
  }

  return (
    <div className="container mt-4">
      <h2>Editar Factura {nofactura}</h2>

      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-2"><label className="form-label">No.</label><input className="form-control" value={form.nofactura} disabled /></div>
          <div className="col-md-3"><label className="form-label">Fecha</label><input type="date" className="form-control" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
          <div className="col-md-5"><label className="form-label">Cliente</label><input list="clientes-list" className="form-control" placeholder="Escriba o seleccione cliente" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} /><datalist id="clientes-list">{clientes.map((c: any) => (<option key={c.id} value={c.name} />))}</datalist></div>
          <div className="col-md-2"><label className="form-label">Cobrado</label><select className="form-select" value={form.cobrado ? "1" : "0"} onChange={e => setForm({ ...form, cobrado: e.target.value === "1" })}><option value="0">No</option><option value="1">Sí</option></select></div>
        </div>
        <div className="row g-2 mt-2"><div className="col"><label className="form-label">Dirección</label><input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div></div>
      </div>

      <h5>Items</h5>
      {form.items.map((it, idx) => (
        <div className="row g-2 mb-2" key={idx}>
          <div className="col-5"><input list="servicios-list" className="form-control" placeholder="Escriba o seleccione servicio" value={it.service} onChange={e => { const n = [...form.items]; n[idx].service = e.target.value; setForm({ ...form, items: n })}} /><datalist id="servicios-list">{servicios.map(s => (<option key={s} value={s} />))}</datalist></div>
          <div className="col-4"><input type="number" step="0.01" className="form-control" placeholder="Importe" value={it.importe} onChange={e => { const n = [...form.items]; n[idx].importe = parseFloat(e.target.value) || 0; setForm({ ...form, items: n })}} /></div>
          <div className="col-3 d-flex align-items-center"><button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(idx)}>Quitar</button></div>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-primary" onClick={addItem}>+ Agregar item</button>
        <div>
          <button className="btn btn-warning" onClick={guardar}>Actualizar Factura</button>
          <ImprimirFactura factura={form} items={items} />
        </div>
      </div>
    </div>
  )
}