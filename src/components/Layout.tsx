import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/dashboard.css";

export default function Layout() {
  return (
    <div className="d-flex w-100">
      <Sidebar />
      <div className="flex-grow-1" style={{ position: "relative" }}>
        <Outlet />
      </div>
    </div>
  );
}
