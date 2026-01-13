import { useMemo, useState } from "react"
import { Column } from "../types/table"

export function useDataTable<T>(data: T[], columns: Column<T>[]) {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const filtered = useMemo(() => {
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
      const va = a[sortKey]; const vb = b[sortKey]
      if (va > vb) return sortDir === "asc" ? 1 : -1
      if (va < vb) return sortDir === "asc" ? -1 : 1
      return 0
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