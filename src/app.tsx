import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import Dashboard from "../pages/Dashboard"
import ServiciosPage from "../pages/ServiciosPage"
import ClientesPage from "../pages/ClientesPage"
import FacturaFormPage from "../pages/FacturaFormPage"
import { checkIfUsersExist } from "./auth"
import { useEffect, useState } from "react"
import FacturaEditPage from "../pages/FacturaEditPage"

export default function App() {
  const [hasUsers, setHasUsers] = useState<boolean | null>(null)
  useEffect(() => { checkIfUsersExist().then(setHasUsers) }, [])

  if (hasUsers === null) return <div className="spinner-border"></div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={hasUsers ? <Navigate to="/login" /> : <Navigate to="/register" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/facturas/nueva" element={<FacturaFormPage />} />
        <Route path="/facturas/editar/:nofactura" element={<FacturaEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}