import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { useNavigate } from "react-router-dom";
import { ImprimirFactura } from "../src/components/ImprimirFactura";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { notify } from "../src/utils/sweetAlert";
import { useQueryClient } from "@tanstack/react-query";
import { FiEdit, FiPrinter, FiTrash2, FiCheckCircle, FiAlertCircle, FiFileText, FiDollarSign } from "react-icons/fi";

export default function Dashboard() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: facturas, remove } = useCrudQuery("/facturas", "facturas");
  const { config } = usePrintConfig();

  const cobradas = facturas?.filter(f => f.cobrado) || [];
  const porCobrar = facturas?.filter(f => !f.cobrado) || [];

  const totalCobradas = cobradas.reduce((sum, f) => sum + Number(f.total), 0);
  const totalPorCobrar = porCobrar.reduce((sum, f) => sum + Number(f.total), 0);
  const totalGeneral = facturas?.reduce((sum, f) => sum + Number(f.total), 0) || 0;

  const columns: Column<any>[] = [
    { key: "fecha", header: "Fecha", sortable: true },
    { key: "nofactura", header: "Nº Factura", sortable: true },
    { key: "customer", header: "Cliente", sortable: true },
    { key: "total", header: "Total", sortable: true, render: (v) => <span className="fw-bold">${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> },
    {
      key: "cobrado",
      header: "Estado",
      sortable: true,
      render: (v) => (
        <span className={`badge-status ${v ? "badge-paid" : "badge-pending"}`}>
          {v ? "Cobrado" : "Pendiente"}
        </span>
      )
    },
    {
      key: "_actions",
      header: "Acciones",
      render: (_, row) => (
        <div className="d-flex gap-1">
          <button onClick={() => nav(`/facturas/editar/${row.nofactura}`)} className="btn-ghost text-warning" title="Editar">
            <FiEdit size={18} />
          </button>
          <button
            onClick={async () => {
              if (!config) {
                notify.error("No hay configuración de impresión disponible");
                return;
              }
              const r = await api.get(`/facturaitems?nofactura=${row.nofactura}`);
              await ImprimirFactura({ factura: row, items: r.data, config });
            }}
            className="btn-ghost text-primary"
            title="Imprimir"
          >
            <FiPrinter size={18} />
          </button>
          {!row.cobrado && (
            <button
              onClick={async () => {
                try {
                  const rFactura = await api.get(`/facturas/${row.nofactura}`);
                  const rItems = await api.get(`/facturaitems?nofactura=${row.nofactura}`);
                  await api.put(`/facturas/${row.nofactura}`, { ...rFactura.data, cobrado: true, items: rItems.data });
                  notify.success("Factura cobrada");
                  qc.invalidateQueries({ queryKey: ["facturas"] });
                } catch {
                  notify.error("Error al marcar factura como cobrada");
                }
              }}
              className="btn-ghost text-success"
              title="Marcar como cobrada"
            >
              <FiDollarSign size={18} />
            </button>
          )}
          <button
            onClick={async () => {
              const ok = await notify.confirm("¿Estás seguro?", "Esta acción eliminará la factura de forma permanente.");
              if (ok) remove(row.nofactura);
            }}
            className="btn-ghost text-danger"
            title="Borrar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-main">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Resumen de Facturación</h2>
          <p className="text-muted mb-0">Gestiona tus facturas y estados de pago</p>
        </div>
        <button onClick={() => nav("/facturas/nueva")} className="btn-modern btn-modern-success">
          <FiFileText /> Nueva Factura
        </button>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-soft-green">
              <FiCheckCircle />
            </div>
            <div>
              <h6 className="text-muted mb-1 uppercase small fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Cobradas</h6>
              <h4 className="fw-bold mb-0">${totalCobradas.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <small className="text-muted">{cobradas.length} Facturas</small>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-soft-yellow">
              <FiAlertCircle />
            </div>
            <div>
              <h6 className="text-muted mb-1 uppercase small fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Por Cobrar</h6>
              <h4 className="fw-bold mb-0">${totalPorCobrar.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <small className="text-muted">{porCobrar.length} Pendientes</small>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-soft-blue">
              <FiFileText />
            </div>
            <div>
              <h6 className="text-muted mb-1 uppercase small fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Total Facturado</h6>
              <h4 className="fw-bold mb-0">${totalGeneral.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <small className="text-muted">{facturas?.length || 0} Total</small>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={facturas || []}
        columns={columns}
        initialSortKey="fecha"
        initialSortDir="desc"
        getRowClassName={(row) => row.cobrado ? "table-light" : ""}
      />
    </div>
  );
}