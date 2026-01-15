import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/dashboard.css";
import { ThemeProvider } from "../context/ThemeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="d-flex w-100">
        <Sidebar />
        <div className="flex-grow-1" style={{ position: "relative" }}>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}
