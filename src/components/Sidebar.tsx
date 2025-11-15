import React, { useState } from "react"
import { FiMenu, FiX, FiLogOut } from "react-icons/fi"
import { logout } from "../auth"

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
      >
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 pt-16 px-4`}
      >
        <nav className="space-y-4">
          <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
            Resumen
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
          >
            <FiLogOut /> Cerrar Sesión
          </button>
        </nav>
      </aside>
    </>
  )
}