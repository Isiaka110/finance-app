import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function SettingsPage() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        emailOrPhone: user?.emailOrPhone || '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                fullName: user.fullName,
                emailOrPhone: user.emailOrPhone
            }));
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (form.password && form.password !== form.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        try {
            const payload = {
                fullName: form.fullName,
                emailOrPhone: form.emailOrPhone
            };
            if (form.password) payload.password = form.password;

            const { data } = await API.put('/auth/profile', payload);

            // Update global state and localStorage via context
            // keep the same token
            login(data.user, localStorage.getItem('financeToken'), false);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800 }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your account and preferences</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gap: 24 }}>
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

                    <form onSubmit={handleUpdate} style={{ display: 'grid', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                className="form-input"
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email or Phone</label>
                            <input
                                className="form-input"
                                value={form.emailOrPhone}
                                onChange={e => setForm({ ...form, emailOrPhone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">New Password (leave blank to keep current)</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>Danger Zone</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                        Once you logout or delete your account, your session will end.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-ghost" onClick={handleLogout}>Logout Session</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
