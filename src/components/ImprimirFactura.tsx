import React from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface Props {
  factura: any
  items: any[]
}

export function ImprimirFactura({ factura, items }: Props) {
  const imprimir = () => {
    const element = document.getElementById("factura-print") as HTMLElement
    html2canvas(element, { scale: 2 }).then(canvas => {
      const img = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`factura_${factura.nofactura}.pdf`)
    })
  }

  return (
    <>
      {/* Botón visible */}
      <button className="btn btn-info btn-sm ms-2" onClick={imprimir}>
        📄 Imprimir
      </button>

      {/* Contenido oculto para PDF */}
      <div id="factura-print" className="d-none">
        <div className="container p-4" style={{ width: "800px", fontFamily: "Arial, sans-serif" }}>
          <div className="row mb-3">
            <div className="col-8"><h2>Factura No. {factura.nofactura}</h2></div>
            <div className="col-4 text-end"><strong>Fecha:</strong> {factura.fecha}</div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Datos del cliente</h5>
              <p><strong>Cliente:</strong> {factura.customer}<br /><strong>Dirección:</strong> {factura.address}</p>
            </div>
          </div>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr><th>Servicio</th><th className="text-end">Importe</th></tr>
            </thead>
              <tbody>
                {items?.map((it, idx) => (
                 <tr key={idx}>
                  <td>{it.service || "-"}</td>
                  <td className="text-end">${(Number(it.importe) || 0).toFixed(2)}</td>
                </tr>
                ))}
            </tbody> 
          </table>
          <div className="text-end">
            <h4>Total: ${(Number(factura?.total) || 0).toFixed(2)}</h4>
            <p><strong>Cobrado:</strong> {factura?.cobrado ? "Sí" : "No"}</p>
          </div>
        </div>
      </div>
    </>
  )
}