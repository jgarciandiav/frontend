import DataTable from "../src/components/DataTable"


export default function Dashboard() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
    <nav className="bg-dark text-white p-3" style={{ width: "220px", height: "100vh" }}>
      <h5 className="mb-4">Menú</h5>
      <ul className="nav flex-column">
        <li className="nav-item"><a className="nav-link text-white" href="/dashboard">Resumen</a></li>
        <li className="nav-item"><a className="nav-link text-white" href="/servicios">Servicios</a></li>
        <li className="nav-item"><a className="nav-link text-white" href="/clientes">Clientes</a></li>
        <li className="nav-item"><a className="nav-link text-white" href="/facturas/nueva">Nueva Factura</a></li>
        <li className="nav-item">
          <button className="nav-link text-white btn btn-link" onClick={() => (window.location.href = "/login")}>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
      {/* Contenido */}
      <main className="flex-fill p-4">
        <h2 className="mb-4">Resumen de Facturas</h2>
        <DataTable />
      </main>
    </div>
  )
}