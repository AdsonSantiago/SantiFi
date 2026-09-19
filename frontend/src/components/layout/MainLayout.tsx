import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./sidebar/Sidebar";
import TopBar from "./topBar/TopBar";

import "./mainLayout.css";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function handleOpenSidebar() {
    setSidebarOpen(true);
  }

  function handleCloseSidebar() {
    setSidebarOpen(false);
  }

  function handleToggleSidebar() {
    setSidebarCollapsed((current) => !current);
  }

  return (
    <div
      className={`main-layout ${
        sidebarCollapsed ? "sidebar-is-collapsed" : ""
      }`}
    >
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={handleCloseSidebar}
        onToggleCollapse={handleToggleSidebar}
      />

      <div className="main-content">
        <TopBar onMenuClick={handleOpenSidebar} />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;