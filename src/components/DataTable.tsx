import { useDataTable } from "../hooks/useDataTable";
import { Column } from "../types/table";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  toolbar?: React.ReactNode;
  getRowClassName?: (row: T) => string;
  initialSortKey?: keyof T | null;
  initialSortDir?: "asc" | "desc";
};

export default function DataTable<T extends object>({
  data,
  columns,
  toolbar,
  getRowClassName,
  initialSortKey = null,
  initialSortDir = "asc"
}: Props<T>) {
  const { rows, page, pages, goto, search, setSearch, sortKey, setSortKey, sortDir, setSortDir } =
    useDataTable(data, columns, initialSortKey, initialSortDir);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="table-custom-container">
      <div className="p-4 d-flex justify-content-between align-items-center">
        <div className="position-relative">
          <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar registros..."
            className="form-control ps-5 rounded-pill border-0 shadow-sm"
            style={{ width: "300px", height: "45px", backgroundColor: "var(--input-bg)", color: "var(--text-dark)" }}
          />
        </div>
        <div>{toolbar}</div>
      </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={col.sortable ? () => handleSort(col.key as keyof T) : undefined}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  <div className="d-flex align-items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-primary">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
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

      <div className="p-4 d-flex justify-content-between align-items-center border-top">
        <div className="small text-muted fw-medium">
          Mostrando registros de la página {page} de {pages}
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="btn btn-sm btn-light border rounded-circle shadow-sm"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => goto(page + 1)}
            disabled={page === pages}
            className="btn btn-sm btn-light border rounded-circle shadow-sm"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}