export type Column<T> = {
  key: keyof T | "_actions"
  header: string
  sortable?: boolean
  render?: (val: any, row: T) => React.ReactNode
}