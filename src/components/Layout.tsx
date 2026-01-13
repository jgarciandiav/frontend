import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function Layout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 md:pt-4" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}
