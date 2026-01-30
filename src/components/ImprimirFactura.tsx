import jsPDF from "jspdf"
import { PrintConfig } from "../types/print"

interface Props {
  factura: any
  items: any[]
  config: PrintConfig
}

async function loadLogo(logoFile: string): Promise<string | null> {
  try {
    const module = await import(`../assets/${logoFile}`)
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => resolve(null)
      img.src = module.default
    })
  } catch {
    return null
  }
}

export async function ImprimirFactura({ factura, items, config }: Props) {
  const pdf = new jsPDF("p", "mm", "a4")
  const margin = 15
  const pageWidth = 210
  let y = margin

  if (config.logo) {
    const logoData = await loadLogo(config.logo)
    if (logoData) {
      pdf.addImage(logoData, "PNG", margin, y, 45, 22)
    }
  }

  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("INVOICE", pageWidth - margin, y + 5, { align: "right" })
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Nº ${factura.nofactura}`, pageWidth - margin, y + 12, { align: "right" })
  pdf.text(`Date: ${factura.fecha}`, pageWidth - margin, y + 18, { align: "right" })

  y += 30

  pdf.setFillColor(245, 245, 245)
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, "F")

  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text("FROM", margin + 3, y + 5)
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text(config.empresa.nombre, margin + 3, y + 11)
  pdf.setFont("helvetica", "normal")
  pdf.text(config.empresa.direccion, margin + 3, y + 17)
  pdf.text(`TAX ID: ${config.empresa.cif}`, margin + 3, y + 23)
  pdf.text(`${config.empresa.cp} - ${config.empresa.telefono}`, margin + 3, y + 29)

  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text("BILL TO", pageWidth - margin, y + 5, { align: "right" })
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text(factura.customer, pageWidth - margin, y + 11, { align: "right" })
  pdf.setFont("helvetica", "normal")
  pdf.text(factura.address || "", pageWidth - margin, y + 17, { align: "right" })

  y += 44

  pdf.setDrawColor(220, 220, 220)
  pdf.setLineWidth(0.5)
  pdf.line(margin, y, pageWidth - margin, y)

  y += 5

  pdf.setFillColor(240, 240, 240)
  pdf.rect(margin, y, pageWidth - margin * 2, 8, "F")
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(0, 0, 0)
  pdf.text("DESCRIPTION", margin + 3, y + 5)
  pdf.text("AMOUNT", pageWidth - margin, y + 5, { align: "right" })

  y += 8

  pdf.setDrawColor(240, 240, 240)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 3

  let total = 0
  items.forEach((it, _) => {
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(0, 0, 0)
    // Usamos la traducción si existe, si no, el original
    pdf.text(it.servicetranslate || it.service, margin + 3, y)
    pdf.setFont("helvetica", "bold")
    pdf.text(`$${Number(it.importe).toFixed(2)}`, pageWidth - margin, y, { align: "right" })
    total += Number(it.importe)
    y += 6

    if (y > 250) {
      pdf.addPage()
      y = margin
      pdf.setFillColor(240, 240, 240)
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F")
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.text("DESCRIPTION", margin + 3, y + 5)
      pdf.text("AMOUNT", pageWidth - margin, y + 5, { align: "right" })
      y += 11
    }
  })

  pdf.setDrawColor(220, 220, 220)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(50, 50, 50)
  pdf.text("TOTAL:", pageWidth - margin - 30, y, { align: "right" })
  pdf.setTextColor(0, 0, 0)
  pdf.text(`$${total.toFixed(2)}`, pageWidth - margin, y, { align: "right" })

  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(150, 150, 150)
    pdf.text(`${config.empresa.nombre} | TAX ID: ${config.empresa.cif} | ${config.empresa.email}`, 105, 290, { align: "center" })
  }

  pdf.save(`factura_${factura.nofactura}.pdf`)
}