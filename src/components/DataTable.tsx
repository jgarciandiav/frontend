import { useDataTable } from "../hooks/useDataTable";
import { Column } from "../types/table";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

type Props<T> = { data: T[]; columns: Column<T>[]; toolbar?: React.ReactNode; getRowClassName?: (row: T) => string };

export default function DataTable<T extends object>({ data, columns, toolbar, getRowClassName }: Props<T>) {
  const { rows, page, pages, goto, search, setSearch, sortKey, setSortKey, sortDir, setSortDir } =
    useDataTable(data, columns);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="form-control w-auto"
            />
          </div>
          <div>{toolbar}</div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={col.sortable ? () => handleSort(col.key as keyof T) : undefined}
                    style={{ cursor: col.sortable ? "pointer" : "default" }}
                  >
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="ms-1">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className={getRowClassName?.(row)}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(row[col.key as keyof T], row) : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="btn btn-sm btn-outline-primary"
          >
            <FiChevronLeft />
          </button>
          <span className="small text-muted">
            Página {page} de {pages}
          </span>
          <button
            onClick={() => goto(page + 1)}
            disabled={page === pages}
            className="btn btn-sm btn-outline-primary"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}