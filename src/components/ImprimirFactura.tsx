import jsPDF from "jspdf"
import { PrintConfig } from "../types/print"

interface Props {
  factura: any
  items: any[]
  config: PrintConfig
}

export function ImprimirFactura({ factura, items, config }: Props) {
  const pdf = new jsPDF("p", "mm", "a4")
  const margin = 20
  const lineHeight = 6
  let y = margin

  if (config.logo) {
    pdf.addImage(config.logo, "PNG", margin, y, 40, 20)
    y += 25
  }

  pdf.setFontSize(10)
  pdf.text(config.empresa.nombre, margin, y)
  pdf.text(`CIF: ${config.empresa.cif}`, margin, y + lineHeight)
  pdf.text(config.empresa.direccion, margin, y + lineHeight * 2)
  pdf.text(`${config.empresa.cp} - Tlf: ${config.empresa.telefono}`, margin, y + lineHeight * 3)
  pdf.text(config.empresa.email, margin, y + lineHeight * 4)

  y += 35
  pdf.setFontSize(14)
  pdf.text(`FACTURA Nº ${factura.nofactura}`, margin, y)
  pdf.setFontSize(10)
  pdf.text(`Fecha: ${factura.fecha}`, margin, y + lineHeight)
  pdf.text(`Cliente: ${factura.customer}`, margin, y + lineHeight * 2)
  pdf.text(`Dirección: ${factura.address}`, margin, y + lineHeight * 3)

  y += 25
  const headers = ["Servicio", "Importe"]
  const colX = [margin, 160]
  pdf.setFont("helvetica", "bold")
  headers.forEach((h, i) => pdf.text(h, colX[i], y))
  pdf.setFont("helvetica", "normal")
  y += lineHeight

  let total = 0
  items.forEach(it => {
    if (y + lineHeight > 280) { pdf.addPage(); y = margin }
    pdf.text(it.service, colX[0], y)
    pdf.text(`$${Number(it.importe).toFixed(2)}`, colX[1], y, { align: "right" })
    total += Number(it.importe)
    y += lineHeight
  })

  if (y + 15 > 280) pdf.addPage()
  pdf.setFontSize(12)
  pdf.text(`Total: $${total.toFixed(2)}`, colX[1], y + 10, { align: "right" })

  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.text(`Gracias por su confianza | ${config.empresa.nombre} | Pág ${i} / ${pageCount}`, 105, 290, { align: "center" })
  }

  pdf.save(`factura_${factura.nofactura}.pdf`)
}