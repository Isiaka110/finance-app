import { useEffect, useState } from 'react';
import API from '../api/axios';

const fmt = (n) => '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
const EMPTY = { name: '', targetAmount: '' };

export default function SavingsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [depositModal, setDepositModal] = useState(null);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [depositAmt, setDepositAmt] = useState('');
    const [saving, setSaving] = useState(false);

    const load = () => API.get('/goals').then(r => setGoals(r.data)).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (g) => { setEditing(g); setForm({ name: g.name, targetAmount: g.targetAmount }); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const payload = { name: form.name, targetAmount: parseFloat(form.targetAmount) };
            if (editing) await API.put(`/goals/${editing._id}`, payload);
            else await API.post('/goals', payload);
            setModal(false); load();
        } finally { setSaving(false); }
    };

    const handleDeposit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const newSaved = depositModal.savedAmount + parseFloat(depositAmt);
            await API.put(`/goals/${depositModal._id}`, { savedAmount: newSaved });
            setDepositModal(null); setDepositAmt(''); load();
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this savings goal?')) return;
        await API.delete(`/goals/${id}`);
        load();
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800 }}>Savings Goals</h1>
                <button className="btn btn-primary" onClick={openAdd}>+ New Goal</button>
            </div>

            {loading ? <div className="empty-state"><p>Loading...</p></div>
                : goals.length === 0
                    ? <div className="empty-state"><div className="empty-icon">🎯</div><p>No savings goals yet. Create your first goal!</p></div>
                    : (
                        <div style={{ display: 'grid', gap: 16 }}>
                            {goals.map(g => {
                                const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                                return (
                                    <div key={g._id} className="card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{g.name}</h3>
                                                    {g.completed ? <span className="badge badge-done">✅ Completed</span> : null}
                                                </div>
                                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                                                    Saved: <strong style={{ color: 'var(--primary)' }}>{fmt(g.savedAmount)}</strong> of <strong>{fmt(g.targetAmount)}</strong>
                                                </p>
                                                <div className="progress-bar">
                                                    <div className={`progress-fill ${g.completed ? 'done' : ''}`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{pct}% reached</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                {!g.completed && (
                                                    <button className="btn btn-primary btn-sm" onClick={() => { setDepositModal(g); setDepositAmt(''); }}>
                                                        + Deposit
                                                    </button>
                                                )}
                                                <button className="btn-icon" onClick={() => openEdit(g)}>✏️</button>
                                                <button className="btn-icon danger" onClick={() => handleDelete(g._id)}>🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

            {/* Create / Edit Goal Modal */}
            {modal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal">
                        <div className="modal-title">{editing ? '✏️ Edit Goal' : '🎯 New Savings Goal'}</div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Goal Name</label>
                                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. New Laptop" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Target Amount (₦)</label>
                                <input className="form-input" type="number" min="1" step="0.01" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create Goal'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {depositModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDepositModal(null)}>
                    <div className="modal">
                        <div className="modal-title">💵 Add to "{depositModal.name}"</div>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
                            Current: {fmt(depositModal.savedAmount)} / {fmt(depositModal.targetAmount)}
                        </p>
                        <form onSubmit={handleDeposit}>
                            <div className="form-group">
                                <label className="form-label">Deposit Amount (₦)</label>
                                <input className="form-input" type="number" min="0.01" step="0.01" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} autoFocus required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setDepositModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Adding...' : 'Add Deposit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
