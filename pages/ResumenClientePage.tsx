import { useState } from "react";
import { api } from "../src/api";
import { Column } from "../src/types/table";
import DataTable from "../src/components/DataTable";

interface ResumenCliente {
  customer: string;
  suma_pagadas: number;
  suma_pendientes: number;
  total: number;
  cantidad_facturas: number;
}

export default function ResumenClientePage() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [data, setData] = useState<ResumenCliente[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: Column<ResumenCliente>[] = [
    { key: "customer", header: "Cliente", sortable: true },
    { key: "suma_pagadas", header: "Suma Pagadas", sortable: true, render: (v) => `$${Number(v).toFixed(2)}` },
    { key: "suma_pendientes", header: "Suma Pendientes", sortable: true, render: (v) => `$${Number(v).toFixed(2)}` },
    { key: "total", header: "Total", sortable: true, render: (v) => `$${Number(v).toFixed(2)}` },
    { key: "cantidad_facturas", header: "Cant. Facturas", sortable: true },
  ];

  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Seleccione rango de fechas");
      return;
    }
    setLoading(true);
    try {
      const [y1, m1, d1] = fechaInicio.split("-");
      const [y2, m2, d2] = fechaFin.split("-");
      const response = await api.get(`/facturas/resumen/clientes?fecha_inicio=${d1}/${m1}/${y1}&fecha_fin=${d2}/${m2}/${y2}`);
      setData(response.data);
    } catch {
      alert("Error al obtener resumen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4 fs-4">Resumen por Cliente</h2>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Fecha Inicio</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Fecha Fin</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="form-control" />
          </div>
          <div className="col-md-4">
            <button onClick={handleBuscar} disabled={loading} className="btn btn-primary">
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>
      {data.length > 0 && <DataTable data={data} columns={columns} />}
    </div>
  );
}
