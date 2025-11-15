import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export function printFactura(factura: any) {
  const element = document.createElement("div")
  element.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2>Factura ${factura.nofactura}</h2>
      <p>Cliente: ${factura.customer}</p>
      <p>Dirección: ${factura.address}</p>
      <p>Fecha: ${factura.fecha}</p>
      <p>Total: $${factura.total}</p>
      <p>Cobrado: ${factura.cobrado ? "Sí" : "No"}</p>
    </div>
  `
  document.body.appendChild(element)
 html2canvas(element).then(canvas => {
  const imgData = canvas.toDataURL('image/png');

  const imgWidth  = Number(canvas.width);
  const imgHeight = Number(canvas.height);
  const pdf       = new jsPDF();
  const pageHeight= pdf.internal.pageSize.height;

  let heightLeft = imgHeight;
  let position   = 0;

  // primera página
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // páginas adicionales si hace falta
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`factura_${factura.nofactura}.pdf`);
  document.body.removeChild(element);
});
}