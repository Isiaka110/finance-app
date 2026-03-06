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
    const [approveConfirm, setApproveConfirm] = useState(null);

    const load = () => API.get('/goals').then(r => setGoals(r.data)).finally(() => setLoading(false));

    const handleApprove = async (id) => {
        setSaving(true);
        try {
            await API.post(`/goals/${id}/approve`);
            setApproveConfirm(null);
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Approval failed');
        } finally {
            setSaving(false);
        }
    };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
    const openEdit = (g) => { setEditing(g); setForm({ name: g.name, targetAmount: g.targetAmount }); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const rawAmt = form.targetAmount.toString().replace(/,/g, '');
            const payload = { name: form.name, targetAmount: parseFloat(rawAmt) };
            if (isNaN(payload.targetAmount)) { alert('Please enter a valid amount'); setSaving(false); return; }
            if (editing) await API.put(`/goals/${editing._id}`, payload);
            else await API.post('/goals', payload);
            setModal(false); load();
        } finally { setSaving(false); }
    };

    const handleDeposit = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            const rawAmt = depositAmt.toString().replace(/,/g, '');
            const amount = parseFloat(rawAmt);
            if (isNaN(amount)) { alert('Please enter a valid amount'); setSaving(false); return; }
            const remaining = depositModal.targetAmount - depositModal.savedAmount;

            let actualAmount = amount;
            let excess = 0;
            if (amount > remaining) {
                actualAmount = remaining;
                excess = amount - remaining;
            }

            const newSaved = depositModal.savedAmount + actualAmount;
            await API.put(`/goals/${depositModal._id}`, { savedAmount: newSaved, excessAmt: excess });
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
                                                    {g.completed && !g.isApproved ? <span className="badge badge-done">✅ Completed</span> : null}
                                                    {g.isApproved ? <span className="badge badge-done" style={{ background: 'var(--success, #10b981)', color: '#fff' }}>✔️ Approved</span> : null}
                                                </div>
                                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
                                                    Saved: <strong style={{ color: 'var(--primary)' }}>{fmt(g.savedAmount)}</strong> of <strong>{fmt(g.targetAmount)}</strong>
                                                </p>
                                                <div className="progress-bar">
                                                    <div className={`progress-fill ${g.completed ? 'done' : ''}`} style={{ width: `${pct}%` }} />
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{pct}% reached</p>
                                                {g.completed && !g.isApproved && (
                                                    <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-card-alt, #f8fafc)', borderRadius: 8, border: '1px solid var(--border)' }}>
                                                        {approveConfirm === g._id ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>The cost will be deducted from your balance</span>
                                                                <div style={{ display: 'flex', gap: 8 }}>
                                                                    <button className="btn-icon danger" onClick={() => setApproveConfirm(null)}>❌</button>
                                                                    <button className="btn-icon success" onClick={() => handleApprove(g._id)}>✅</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setApproveConfirm(g._id)}>
                                                                APPROVE
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
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
                                <label className="form-label">Enter amount</label>
                                <input className="form-input" type="text" placeholder="e.g. 50,000" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value.replace(/[^0-9.,]/g, '') }))} required />
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
                                <label className="form-label">Enter amount</label>
                                <input className="form-input" type="text" placeholder="e.g. 10,000" value={depositAmt} onChange={e => setDepositAmt(e.target.value.replace(/[^0-9.,]/g, ''))} autoFocus required />
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDepositAmt(Math.ceil(depositModal.targetAmount / 10).toLocaleString())}>x10</button>
                                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDepositAmt(Math.ceil(depositModal.targetAmount / 5).toLocaleString())}>x5</button>
                                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDepositAmt(Math.ceil(depositModal.targetAmount / 3).toLocaleString())}>x3</button>
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
