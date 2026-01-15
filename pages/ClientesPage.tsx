import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { notify } from "../src/utils/sweetAlert";
import { FiTrash2, FiUsers } from "react-icons/fi";

export default function ClientesPage() {
  const { data, create, remove } = useCrudQuery("/clientes", "clientes");

  const columns: Column<any>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Nombre", sortable: true },
    { key: "address", header: "Dirección", sortable: true },
    {
      key: "_actions",
      header: "",
      render: (_, row) => (
        <button
          onClick={async () => {
            const ok = await notify.confirm("¿Borrar cliente?", "Esta acción no se puede deshacer.");
            if (ok) {
              remove(row.id).then(() => notify.success("Cliente eliminado"));
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
          <h2 className="fw-bold mb-1">Clientes</h2>
          <p className="text-muted mb-0">Gestiona el catálogo de clientes</p>
        </div>
        <button
          onClick={() => {
            const name = prompt("Nombre");
            const address = prompt("Dirección");
            if (name && address) {
              create({ name, address }).then(() => notify.success("Cliente creado"));
            }
          }}
          className="btn-modern btn-modern-success"
        >
          <FiUsers /> Agregar Cliente
        </button>
      </div>
      <DataTable
        data={data || []}
        columns={columns}
      />
    </div>
  );
}