import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { useNavigate } from "react-router-dom";
import { ImprimirFactura } from "../src/components/ImprimirFactura";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";

export default function Dashboard() {
  const nav = useNavigate();
  const { data: facturas, remove } = useCrudQuery("/facturas", "facturas");
  const { config } = usePrintConfig();

  const columns: Column<any>[] = [
    { key: "nofactura", header: "Nº Factura", sortable: true },
    { key: "customer", header: "Cliente", sortable: true },
    { key: "total", header: "Total", sortable: true, render: (v) => `$${Number(v).toFixed(2)}` },
    { key: "cobrado", header: "Cobrado", sortable: true, render: (v) => (v ? "Sí" : "No") },
    {
      key: "_actions",
      header: "Acciones",
      render: (_, row) => (
        <div className="btn-group btn-group-sm">
          <button onClick={() => nav(`/facturas/editar/${row.nofactura}`)} className="btn btn-warning">
            Editar
          </button>
          <button
            onClick={() => {
              if (!config) {
                alert("No hay configuración de impresión disponible");
                return;
              }
              api.get(`/facturaitems?nofactura=${row.nofactura}`)
                .then((r) => {
                  ImprimirFactura({ factura: row, items: r.data, config });
                });
            }}
            className="btn btn-primary"
          >
            Imprimir
          </button>
          <button
            onClick={() => {
              if (confirm("¿Borrar factura?")) remove(row.nofactura);
            }}
            className="btn btn-danger"
          >
            Borrar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-4 fs-4">Facturas</h2>
      <DataTable
        data={facturas || []}
        columns={columns}
        toolbar={
          <button onClick={() => nav("/facturas/nueva")} className="btn btn-success">
            + Nueva Factura
          </button>
        }
      />
    </div>
  );
}