import { useEffect, useState } from 'react';
import API from '../api/axios';

const CATEGORIES = ['Food', 'Transport', 'Books', 'Utilities', 'Entertainment', 'Clothing', 'Health', 'Other'];
const fmt = (n) => '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
const EMPTY = { amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), note: '' };

export default function ExpensePage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [filterCat, setFilterCat] = useState('All');

    const load = () => API.get('/transactions').then(r => setList(r.data.filter(t => t.type === 'expense'))).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
    const openEdit = (tx) => { setEditing(tx); setForm({ amount: tx.amount, category: tx.category, date: tx.date?.slice(0, 10), note: tx.note || '' }); setError(''); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setError(''); setSaving(true);
        try {
            const rawAmt = form.amount.toString().replace(/,/g, '');
            const payload = { ...form, type: 'expense', amount: parseFloat(rawAmt) };
            if (isNaN(payload.amount)) return setError('Please enter a valid amount');
            if (editing) await API.put(`/transactions/${editing._id}`, payload);
            else await API.post('/transactions', payload);
            setModal(false); load();
        } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this expense?')) return;
        await API.delete(`/transactions/${id}`);
        load();
    };

    const total = list.reduce((s, t) => s + t.amount, 0);
    const displayed = filterCat === 'All' ? list : list.filter(t => t.category === filterCat);

    const CAT_ICONS = { Food: '🍔', Transport: '🚌', Books: '📚', Utilities: '💡', Entertainment: '🎮', Clothing: '👕', Health: '💊', Other: '📦' };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800 }}>Expenses</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>Total: <strong style={{ color: 'var(--danger)' }}>{fmt(total)}</strong></p>
                </div>
                <button className="btn btn-danger" onClick={openAdd}>+ Add Expense</button>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {['All', ...CATEGORIES].map(c => (
                    <button key={c} className={`btn btn-sm ${filterCat === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterCat(c)}>
                        {CAT_ICONS[c] || ''} {c}
                    </button>
                ))}
            </div>

            <div className="card">
                {loading ? <div className="empty-state"><p>Loading...</p></div>
                    : displayed.length === 0 ? <div className="empty-state"><div className="empty-icon">💸</div><p>No expenses recorded yet.</p></div>
                        : (
                            <>
                                <div className="table-wrapper">
                                    <table>
                                        <thead><tr><th>Date</th><th>Category</th><th>Notes</th><th>Amount</th><th>Actions</th></tr></thead>
                                        <tbody>
                                            {displayed.map(t => (
                                                <tr key={t._id}>
                                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                                    <td>{CAT_ICONS[t.category] || '📦'} <strong>{t.category}</strong></td>
                                                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.note || '—'}</td>
                                                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>-{fmt(t.amount)}</td>
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
                                    {displayed.map(t => (
                                        <div key={t._id} className="mobile-card">
                                            <div className="mobile-card-main">
                                                <div className="mobile-card-title">{CAT_ICONS[t.category] || ''} {t.category}</div>
                                                <div className="mobile-card-sub">{new Date(t.date).toLocaleDateString()} • {t.note || '—'}</div>
                                            </div>
                                            <div className="mobile-card-side">
                                                <div className="mobile-card-amount" style={{ color: 'var(--danger)' }}>-{fmt(t.amount)}</div>
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
                        <div className="modal-title">{editing ? '✏️ Edit Expense' : '💸 Add Expense'}</div>
                        {error && <div className="alert alert-error">{error}</div>}
                        <form onSubmit={handleSave}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Enter amount</label>
                                    <input className="form-input" type="text" placeholder="e.g. 5,000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value.replace(/[^0-9.,]/g, '') }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes (optional)</label>
                                <input className="form-input" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Lunch at cafeteria" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-danger" disabled={saving}>{saving ? 'Saving...' : 'Save Expense'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
