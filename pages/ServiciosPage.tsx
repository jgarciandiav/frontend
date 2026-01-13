import DataTable from "../src/components/DataTable";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { Column } from "../src/types/table";
import { notify } from "../src/utils/sweetAlert";

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
          onClick={() => {
            if (confirm("¿Borrar servicio?")) {
              remove(row.id).then(() => notify.success("Servicio eliminado"));
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
      <h2 className="mb-4">Servicios</h2>
      <DataTable
        data={data || []}
        columns={columns}
        toolbar={
          <button
            onClick={() => {
              const nombre = prompt("Nombre del servicio");
              if (nombre) {
                create({ service: nombre }).then(() => notify.success("Servicio creado"));
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