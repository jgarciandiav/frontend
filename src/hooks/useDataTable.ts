import { useMemo, useState } from "react"
import { Column } from "../types/table"

export function useDataTable<T>(
  data: T[],
  columns: Column<T>[],
  initialSortKey: keyof T | null = null,
  initialSortDir: "asc" | "desc" = "asc"
) {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey)
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir)

  const filtered = useMemo(() => {
    /* ... same as before ... */
    if (!search) return data
    const lower = search.toLowerCase()
    return data.filter(row =>
      columns.some(col => {
        const val = String(row[col.key as keyof T] ?? "").toLowerCase()
        return val.includes(lower)
      })
    )
  }, [data, search, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let va: any = a[sortKey];
      let vb: any = b[sortKey];

      // Handle custom date sorting for "dd/mm/yyyy"
      if (typeof va === 'string' && va.includes('/') && va.split('/').length === 3) {
        const [d1, m1, y1] = va.split('/').map(Number);
        const [d2, m2, y2] = (vb as string).split('/').map(Number);
        const date1 = new Date(y1, m1 - 1, d1).getTime();
        const date2 = new Date(y2, m2 - 1, d2).getTime();
        return sortDir === "asc" ? date1 - date2 : date2 - date1;
      }

      if (va > vb) return sortDir === "asc" ? 1 : -1;
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      return 0;
    })
  }, [filtered, sortKey, sortDir])

  const total = sorted.length
  const pages = Math.ceil(total / pageSize)
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  const goto = (p: number) => setPage(Math.min(Math.max(p, 1), pages))

  return { rows: paged, page, pages, goto, search, setSearch, sortKey, setSortKey, sortDir, setSortDir }
}