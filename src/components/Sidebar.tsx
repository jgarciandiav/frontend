import { useState } from "react"
import { FiMenu, FiX, FiLogOut, FiHome, FiFileText, FiUsers, FiSettings, FiPieChart, FiSun, FiMoon } from "react-icons/fi"
import { logout } from "../auth"
import { useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/servicios", label: "Servicios", icon: <FiFileText /> },
    { path: "/clientes", label: "Clientes", icon: <FiUsers /> },
    { path: "/resumen-clientes", label: "Resumen Cliente", icon: <FiPieChart /> },
    { path: "/settings", label: "Configuración", icon: <FiSettings /> },
  ]

  const SidebarContent = () => (
    <>
      <div className="d-flex align-items-center gap-3 mb-5 px-2">
        <div className="bg-primary rounded-3 p-2 text-white shadow-sm">
          <FiFileText size={20} />
        </div>
        <h5 className="mb-0 fw-bold text-theme-primary">FactuFlow</h5>
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`nav-link-custom ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-top">
        <button
          onClick={toggleTheme}
          className="nav-link-custom w-100 bg-transparent border-0 text-start mb-2"
        >
          {theme === 'light' ? (
            <><FiMoon /> Modo Oscuro</>
          ) : (
            <><FiSun /> Modo Claro</>
          )}
        </button>
        <button
          onClick={logout}
          className="nav-link-custom text-danger w-100 bg-transparent border-0 text-start"
        >
          <FiLogOut /> Cerrar Sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="d-md-none position-fixed top-0 start-0 z-50 m-3 btn btn-white shadow-sm border rounded-circle p-2"
        style={{ width: "45px", height: "45px" }}
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-40"
          style={{ backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar-container d-none d-md-flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`sidebar-container d-md-none ${mobileOpen ? "d-flex" : "d-none"}`}
        style={{
          width: "280px",
          zIndex: 1001,
          transition: "transform 0.3s ease-in-out",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)"
        }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}