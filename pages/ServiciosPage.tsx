import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { notify } from "../src/utils/sweetAlert";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";

export default function ServiciosPage() {
  const { data, create, remove } = useCrudQuery("/servicios", "servicios");

  const columns: Column<any>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "service", header: "Servicio", sortable: true },
    {
      key: "_actions",
      header: "",
      render: (_, row) => (
        <button
          onClick={async () => {
            const ok = await notify.confirm("¿Borrar servicio?", "Esta acción no se puede deshacer.");
            if (ok) {
              remove(row.id).then(() => notify.success("Servicio eliminado"));
            }
          }}
          className="btn-ghost text-danger"
          title="Borrar"
        >
          <FiTrash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="dashboard-main">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">Servicios</h2>
          <p className="text-muted mb-0">Gestiona los servicios disponibles</p>
        </div>
        <button
          onClick={() => {
            const nombre = prompt("Nombre del servicio");
            if (nombre) {
              create({ service: nombre }).then(() => notify.success("Servicio creado"));
            }
          }}
          className="btn-modern btn-modern-success"
        >
          <FiPlusCircle /> Nuevo Servicio
        </button>
      </div>
      <DataTable
        data={data || []}
        columns={columns}
      />
    </div>
  );
}