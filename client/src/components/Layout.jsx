import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <div
      className={`app-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>

          {sidebarOpen && (
            <div>
              <h2>TeamTask</h2>
              <span>Collaboration</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {sidebarOpen && <p className="menu-title">MAIN MENU</p>}

          <NavLink to="/" className={navClass}>
            <span>🏠</span>
            {sidebarOpen && "Dashboard"}
          </NavLink>

          <NavLink to="/tasks" className={navClass}>
            <span>✓</span>
            {sidebarOpen && "Tasks"}
          </NavLink>

          <NavLink to="/teams" className={navClass}>
            <span>👥</span>
            {sidebarOpen && "Teams"}
          </NavLink>

          <NavLink to="/notifications" className={navClass}>
            <span>🔔</span>
            {sidebarOpen && "Notifications"}
          </NavLink>
        </nav>

        {sidebarOpen && (
          <div className="sidebar-bottom">
            <div className="user-profile">
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>

            <button className="logout-button" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        )}
      </aside>

      <main className="main-content">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <Outlet />
      </main>
    </div>
  );
}
