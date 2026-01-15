import { useState } from "react"
import { FiMenu, FiX, FiLogOut, FiHome, FiFileText, FiUsers, FiSettings, FiPieChart } from "react-icons/fi"
import { logout } from "../auth"

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="d-block d-md-none position-fixed top-0 start-0 z-50 p-3 bg-white border rounded shadow-sm"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="d-block d-md-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-40"
          style={{ position: "fixed", inset: 0 }}
        />
      )}

      <aside className="d-none d-md-flex flex-column w-64 h-100 bg-white shadow-sm pt-16 px-4 position-sticky top-0" style={{ height: "100vh" }}>
        <h5 className="mb-4 fw-bold">Facturación</h5>
        <nav className="d-flex flex-column gap-2">
          <a href="/dashboard" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
            <FiHome /> Resumen
          </a>
          <a href="/servicios" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
            <FiFileText /> Servicios
          </a>
          <a href="/clientes" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
            <FiUsers /> Clientes
          </a>
          <a href="/resumen-clientes" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
            <FiPieChart /> Resumen por Cliente
          </a>
          <a href="/settings" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
            <FiSettings /> Configuración
          </a>
          <button
            onClick={logout}
            className="d-flex align-items-center gap-2 px-4 py-2 rounded hover-bg-gray-100 text-danger w-100 bg-transparent border-0 text-start"
          >
            <FiLogOut /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {mobileOpen && (
        <aside className="d-block d-md-none position-fixed top-0 start-0 h-100 w-64 bg-white shadow-sm z-40 pt-16 px-4" style={{ height: "100vh", width: "16rem", zIndex: 40 }}>
          <h5 className="mb-4 fw-bold">Facturación</h5>
          <nav className="d-flex flex-column gap-2">
            <a href="/dashboard" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
              <FiHome /> Resumen
            </a>
            <a href="/servicios" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
              <FiFileText /> Servicios
            </a>
            <a href="/clientes" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
              <FiUsers /> Clientes
            </a>
            <a href="/resumen-clientes" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
              <FiPieChart /> Resumen por Cliente
            </a>
            <a href="/settings" className="d-flex align-items-center gap-2 px-4 py-2 text-decoration-none text-dark rounded hover-bg-gray-100">
              <FiSettings /> Configuración
            </a>
            <button
              onClick={logout}
              className="d-flex align-items-center gap-2 px-4 py-2 rounded hover-bg-gray-100 text-danger w-100 bg-transparent border-0 text-start"
            >
              <FiLogOut /> Cerrar Sesión
            </button>
          </nav>
        </aside>
      )}
    </>
  )
}