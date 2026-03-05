import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
    { path: '/dashboard/income', label: 'Income', icon: '💰' },
    { path: '/dashboard/expenses', label: 'Expenses', icon: '💸' },
    { path: '/dashboard/savings', label: 'Savings Goals', icon: '🎯' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/auth'); };

    return (
        <div className="app-layout">
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="logo-icon">💎</div>
                    <div>
                        <h2>FinTrack</h2>
                        <span>Student Finance</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(({ path, label, icon, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item" style={{ color: '#f87171' }} onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                    <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
                    <div className="topbar-title">FinTrack</div>
                    <div className="topbar-user" onClick={() => navigate('/dashboard/settings')} style={{ cursor: 'pointer' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            Hi, <strong>{user?.fullName?.split(' ')[0]}</strong>
                        </span>
                        <div className="avatar">{user?.fullName?.[0]?.toUpperCase() || 'U'}</div>
                    </div>
                </header>

                <div className="main-content" style={{ overflowY: 'auto' }}>
                    <div className="page-wrapper">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div >
    );
}
