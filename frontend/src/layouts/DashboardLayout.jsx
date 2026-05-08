import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar.jsx";
import { Navbar } from "../components/common/Navbar.jsx";

export function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
