import React, { useEffect } from "react"
import jsPDF from "jspdf"

interface Props {
  factura: any
  items: any[]
}
export function ImprimirFactura({ factura, items }: Props) {
  // 🔥 Imprime automáticamente cuando lleguen items y no estén vacíos
  useEffect(() => {
    if (items.length === 0) return // no imprime si no hay items
    imprimir()
  }, [items])

  const imprimir = () => {
    if (!items.length) return

    const pdf = new jsPDF("p", "mm", "a4")
    const margen = 20
    let y = margen

    // Encabezado
    pdf.setFontSize(18)
    pdf.text("FACTURA", margen, y)
    pdf.setFontSize(11)
    pdf.text(`No. ${factura.nofactura}`, margen, y + 8)
    pdf.text(`Fecha: ${factura.fecha}`, margen, y + 16)
    pdf.text(`Cobrado: ${factura.cobrado ? "Sí" : "No"}`, margen, y + 24)

    // Cliente
    y += 40
    pdf.setFontSize(12)
    pdf.text("Cliente: " + factura.customer, margen, y)
    pdf.text("Dirección: " + factura.address, margen, y + 8)

    // Tabla
    y += 20
    pdf.setFontSize(11)
    pdf.text("Servicio", margen, y)
    pdf.text("Importe", 180, y)
    y += 8

    items.forEach((it: { service: any; importe: any }, idx: any) => {
      pdf.text(it.service || "-", margen, y)
      pdf.text(`$${Number(it.importe).toFixed(2)}`, 180, y, { align: "right" })
      y += 6
    })

    // Total
    y += 10
    pdf.setFontSize(14)
    pdf.text(`Total: $${Number(factura.total).toFixed(2)}`, 180, y, { align: "right" })

    // Pie
    y += 20
    pdf.setFontSize(10)
    pdf.text("Gracias por su confianza", 105, y, { align: "center" })
    pdf.text(`Generado el ${new Date().toLocaleString("es-ES")}`, 105, y + 6, { align: "center" })

    pdf.save(`factura_${factura.nofactura}.pdf`)
  }

  return (
    <>
      {/* Solo el contenido para PDF */}
      <div id={`factura-print-${factura.nofactura}`} className="d-none">
        <div className="container p-4" style={{ width: "800px", fontFamily: "Arial, sans-serif", backgroundColor: "#fff" }}>
          <div className="row mb-4">
            <div className="col-8"><h2 className="mb-1">FACTURA</h2><h5 className="text-muted">No. {factura.nofactura}</h5></div>
            <div className="col-4 text-end"><p className="mb-1"><strong>Fecha:</strong> {factura.fecha}</p><p className="mb-0"><strong>Cobrado:</strong> {factura.cobrado ? "Sí" : "No"}</p></div>
          </div>
          <div className="card mb-4"><div className="card-body"><h5 className="card-title">Datos del cliente</h5><p className="mb-1"><strong>Cliente:</strong> {factura.customer}</p><p className="mb-0"><strong>Dirección:</strong> {factura.address}</p></div></div>
          <table className="table table-bordered"><thead className="table-light"><tr><th>Servicio</th><th className="text-end">Importe</th></tr></thead><tbody>{items.map((it: { service: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; importe: any }, idx: React.Key | null | undefined) => (<tr key={idx}><td>{it.service}</td><td className="text-end">${Number(it.importe).toFixed(2)}</td></tr>))}</tbody></table>
          <div className="text-end"><h4>Total: ${Number(factura.total).toFixed(2)}</h4></div>
          <div className="mt-4 text-center text-muted">Gracias por su confianza<br /><small>Generado el {new Date().toLocaleString("es-ES")}</small></div>
        </div>
      </div>
    </>
  )
}