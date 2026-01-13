import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { notify } from "../src/utils/sweetAlert";

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
          onClick={() => {
            if (confirm("¿Borrar cliente?")) {
              remove(row.id).then(() => notify.success("Cliente eliminado"));
            }
          }}
          className="btn btn-sm btn-danger"
        >
          Borrar
        </button>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="mb-4">Clientes</h2>
      <DataTable
        data={data || []}
        columns={columns}
        toolbar={
          <button
            onClick={() => {
              const name = prompt("Nombre");
              const address = prompt("Dirección");
              if (name && address) {
                create({ name, address }).then(() => notify.success("Cliente creado"));
              }
            }}
            className="btn btn-success"
          >
            + Agregar
          </button>
        }
      />
    </div>
  );
}