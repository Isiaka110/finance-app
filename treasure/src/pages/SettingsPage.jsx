import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page-wrapper">
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your account and preferences</p>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
                {/* Profile Card */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                        <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{user?.fullName}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{user?.emailOrPhone}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" value={user?.fullName || ''} readOnly disabled />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email or Phone</label>
                            <input className="form-input" value={user?.emailOrPhone || ''} readOnly disabled />
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button className="btn btn-primary" disabled>Update Profile</button>
                            <button className="btn btn-ghost" disabled>Change Password</button>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>Danger Zone</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-danger" onClick={() => alert('Feature coming soon!')}>Delete Account</button>
                        <button className="btn btn-ghost" onClick={handleLogout}>Logout Session</button>
                    </div>
                </div>
            </div>
        </div >
    );
}
