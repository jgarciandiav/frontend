import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { useNavigate } from "react-router-dom";
import { ImprimirFactura } from "../src/components/ImprimirFactura";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { FiEdit, FiPrinter, FiTrash2, FiCheckCircle, FiAlertCircle, FiFileText } from "react-icons/fi";

export default function Dashboard() {
  const nav = useNavigate();
  const { data: facturas, remove } = useCrudQuery("/facturas", "facturas");
  const { config } = usePrintConfig();

  const cobradas = facturas?.filter(f => f.cobrado) || [];
  const porCobrar = facturas?.filter(f => !f.cobrado) || [];

  const totalCobradas = cobradas.reduce((sum, f) => sum + Number(f.total), 0);
  const totalPorCobrar = porCobrar.reduce((sum, f) => sum + Number(f.total), 0);
  const totalGeneral = facturas?.reduce((sum, f) => sum + Number(f.total), 0) || 0;

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
          <button onClick={() => nav(`/facturas/editar/${row.nofactura}`)} className="btn btn-warning" title="Editar">
            <FiEdit size={16} />
          </button>
          <button
            onClick={async () => {
              if (!config) {
                alert("No hay configuración de impresión disponible");
                return;
              }
              const r = await api.get(`/facturaitems?nofactura=${row.nofactura}`);
              await ImprimirFactura({ factura: row, items: r.data, config });
            }}
            className="btn btn-primary"
            title="Imprimir"
          >
            <FiPrinter size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm("¿Borrar factura?")) remove(row.nofactura);
            }}
            className="btn btn-danger"
            title="Borrar"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-4 fs-4">Facturas</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-success">
                  <FiCheckCircle size={40} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Cobradas</h6>
                  <h4 className="mb-0">{cobradas.length}</h4>
                  <small className="text-muted">${totalCobradas.toFixed(2)} MXN</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-warning">
                  <FiAlertCircle size={40} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Por Cobrar</h6>
                  <h4 className="mb-0">{porCobrar.length}</h4>
                  <small className="text-muted">${totalPorCobrar.toFixed(2)} MXN</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary">
                  <FiFileText size={40} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total</h6>
                  <h4 className="mb-0">{facturas?.length || 0}</h4>
                  <small className="text-muted">${totalGeneral.toFixed(2)} MXN</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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