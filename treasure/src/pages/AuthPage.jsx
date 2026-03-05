import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function AuthPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ fullName: '', emailOrPhone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
            const { data } = await API.post(endpoint, form);
            login(data.user, data.token, data.isNew);
            navigate(data.isNew ? '/welcome' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-circle">💎</div>
                    <h1>FinTrack</h1>
                    <p>Personal Finance &amp; Savings for Students</p>
                </div>

                <div className="auth-tabs">
                    <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Login</button>
                    <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Sign Up</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {tab === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Email or Phone Number</label>
                        <input className="form-input" name="emailOrPhone" placeholder="email@example.com or 08012345678" value={form.emailOrPhone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} type="submit" disabled={loading}>
                        {loading ? '⏳ Please wait...' : tab === 'login' ? '🚀 Login' : '✨ Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
