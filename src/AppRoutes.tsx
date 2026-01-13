import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { checkIfUsersExist } from "./auth"
import { useEffect, useState } from "react"
import Spinner from "./components/Spinner"
import Layout from "./components/Layout"

const LoginPage     = lazy(() => import("../pages/LoginPage"))
const RegisterPage  = lazy(() => import("../pages/RegisterPage"))
const Dashboard     = lazy(() => import("../pages/Dashboard"))
const ServiciosPage = lazy(() => import("../pages/ServiciosPage"))
const ClientesPage  = lazy(() => import("../pages/ClientesPage"))
const FacturaFormPage  = lazy(() => import("../pages/FacturaFormPage"))
const FacturaEditPage  = lazy(() => import("../pages/FacturaEditPage"))
const SettingsPage     = lazy(() => import("../pages/SettingsPage"))

export default function AppRoutes() {
  const [hasUsers, setHasUsers] = useState<boolean | null>(null)
  useEffect(() => { checkIfUsersExist().then(setHasUsers) }, [])

  if (hasUsers === null) return <Spinner />

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={hasUsers ? <Navigate to="/login" /> : <Navigate to="/register" />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard"element={<Dashboard />} />
            <Route path="/servicios"element={<ServiciosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/facturas/nueva"  element={<FacturaFormPage />} />
            <Route path="/facturas/editar/:nofactura" element={<FacturaEditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}