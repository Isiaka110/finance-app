import { useEffect, useState } from 'react';
import API from '../api/axios';

function fmt(n) { return '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        API.get('/transactions')
            .then(t => setTransactions(t.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    if (loading) return <div className="empty-state">⏳ Loading history...</div>;

    return (
        <div className="page-wrapper">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Transaction History</h1>

            <div className="card">
                {transactions.length === 0 ? (
                    <div className="empty-state">No transactions yet.</div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t._id}>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.note || t.source || '—'}</td>
                                            <td>{t.category}</td>
                                            <td><span className={`badge badge-${t.type}`}>{t.type}</span></td>
                                            <td style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--accent-dark)' : 'var(--danger)' }}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="mobile-list-container">
                            {transactions.map(t => (
                                <div key={t._id} className="mobile-card">
                                    <div className="mobile-card-main">
                                        <div className="mobile-card-title">{t.category}</div>
                                        <div className="mobile-card-sub">{new Date(t.date).toLocaleDateString()} • {t.note || t.source || '—'}</div>
                                    </div>
                                    <div className="mobile-card-side">
                                        <div className="mobile-card-amount" style={{ color: t.type === 'income' ? 'var(--accent-dark)' : 'var(--danger)' }}>
                                            {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                        </div>
                                        <span className={`badge badge-${t.type}`}>{t.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
