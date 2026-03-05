import { useEffect, useState } from 'react';
import API from '../api/axios';

const SOURCES = ['Allowance', 'Part-time Job', 'Scholarship', 'Freelance', 'Gift', 'Other'];
const fmt = (n) => '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

const EMPTY = { amount: '', category: 'Allowance', source: '', date: new Date().toISOString().slice(0, 10), note: '' };

export default function IncomePage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = () => API.get('/transactions').then(r => setList(r.data.filter(t => t.type === 'income'))).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
    const openEdit = (tx) => { setEditing(tx); setForm({ amount: tx.amount, category: tx.category, source: tx.source || '', date: tx.date?.slice(0, 10), note: tx.note || '' }); setError(''); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setError(''); setSaving(true);
        try {
            const payload = { ...form, type: 'income', amount: parseFloat(form.amount) };
            if (editing) await API.put(`/transactions/${editing._id}`, payload);
            else await API.post('/transactions', payload);
            setModal(false); load();
        } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this income entry?')) return;
        await API.delete(`/transactions/${id}`);
        load();
    };

    const total = list.reduce((s, t) => s + t.amount, 0);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Income</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>Total: <strong style={{ color: 'var(--accent-dark)' }}>{fmt(total)}</strong></p>
                </div>
                <button className="btn btn-success" onClick={openAdd}>+ Add Income</button>
            </div>

            <div className="card">
                {loading ? <div className="empty-state"><p>Loading...</p></div>
                    : list.length === 0 ? <div className="empty-state"><div className="empty-icon">💰</div><p>No income recorded yet. Add your first entry!</p></div>
                        : (
                            <>
                                <div className="table-wrapper">
                                    <table>
                                        <thead><tr><th>Date</th><th>Source/Category</th><th>Notes</th><th>Amount</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {list.map(t => (
                                                <tr key={t._id}>
                                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                                    <td><strong>{t.category}</strong> {t.source && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>· {t.source}</span>}</td>
                                                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.note || '—'}</td>
                                                    <td style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>+{fmt(t.amount)}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: 6 }}>
                                                            <button className="btn-icon" onClick={() => openEdit(t)} title="Edit">✏️</button>
                                                            <button className="btn-icon danger" onClick={() => handleDelete(t._id)} title="Delete">🗑️</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mobile-list-container">
                                    {list.map(t => (
                                        <div key={t._id} className="mobile-card">
                                            <div className="mobile-card-main">
                                                <div className="mobile-card-title">{t.category}</div>
                                                <div className="mobile-card-sub">{new Date(t.date).toLocaleDateString()} • {t.note || '—'}</div>
                                            </div>
                                            <div className="mobile-card-side">
                                                <div className="mobile-card-amount" style={{ color: 'var(--accent-dark)' }}>+{fmt(t.amount)}</div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn-icon" style={{ padding: '4px 8px' }} onClick={() => openEdit(t)}>✏️</button>
                                                    <button className="btn-icon danger" style={{ padding: '4px 8px' }} onClick={() => handleDelete(t._id)}>🗑️</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal">
                        <div className="modal-title">{editing ? '✏️ Edit Income' : '💰 Add Income'}</div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSave}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Amount (₦)</label>
                                    <input className="form-input" type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Source</label>
                                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes (optional)</label>
                                <input className="form-input" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Monthly allowance from parents" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : 'Save Income'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
