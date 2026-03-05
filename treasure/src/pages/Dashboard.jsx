import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function fmt(n) { return '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([API.get('/transactions'), API.get('/goals')])
            .then(([t, g]) => { setTransactions(t.data); setGoals(g.data); })
            .finally(() => setLoading(false));
    }, []);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
    const balance = totalIncome - totalExpense - totalSaved;

    // Pie chart — expense by category
    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

    // Bar chart — monthly income vs expense (last 6 months)
    const monthlyMap = {};
    transactions.forEach(t => {
        const m = t.date?.slice(0, 7);
        if (!m) return;
        if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expense: 0 };
        monthlyMap[m][t.type] += t.amount;
    });
    const barData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6)
        .map(m => ({ ...m, month: new Date(m.month + '-01').toLocaleString('default', { month: 'short' }) }));

    const recent = [...transactions].slice(0, 5);

    if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading your finances...</p></div>;

    return (
        <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Dashboard</h1>

            {/* Stat Cards */}
            <div className="stat-grid">
                <div className="stat-card income" onClick={() => navigate('/dashboard/income')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div className="stat-label">Total Income</div>
                    <div className="stat-value green">{fmt(totalIncome)}</div>
                    <div className="stat-icon">💰</div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 16, opacity: 0.5 }}>↗</div>
                </div>
                <div className="stat-card expense" onClick={() => navigate('/dashboard/expenses')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div className="stat-label">Total Expenses</div>
                    <div className="stat-value red">{fmt(totalExpense)}</div>
                    <div className="stat-icon">💸</div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 16, opacity: 0.5 }}>↗</div>
                </div>
                <div className="stat-card balance" onClick={() => navigate('/dashboard/history')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div className="stat-label">Balance</div>
                    <div className={`stat-value ${balance >= 0 ? 'blue' : 'red'}`}>{fmt(balance)}</div>
                    <div className="stat-icon">💳</div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 16, opacity: 0.5 }}>↗</div>
                </div>
                <div className="stat-card savings" onClick={() => navigate('/dashboard/savings')} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div className="stat-label">Savings Goals</div>
                    <div className="stat-value">{goals.length}</div>
                    <div className="stat-icon">🎯</div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 16, opacity: 0.5 }}>↗</div>
                </div>
            </div>

            {/* Savings Goals Progress */}
            {goals.length > 0 && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <div className="card-title">🎯 Savings Goals Progress</div>
                        <Link to="/dashboard/savings" className="btn btn-ghost btn-sm">View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {goals.slice(0, 3).map(g => {
                            const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                            return (
                                <div key={g._id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600, fontSize: 14 }}>{g.name} {g.completed ? '✅' : ''}</span>
                                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{fmt(g.savedAmount)} / {fmt(g.targetAmount)} ({pct}%)</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className={`progress-fill ${g.completed ? 'done' : ''}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">Expense Breakdown</div>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v) => fmt(v)} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className="empty-state" style={{ padding: 40 }}><div className="empty-icon">📊</div><p>No expense data yet</p></div>}
                </div>

                <div className="chart-card">
                    <div className="chart-title">Monthly Overview</div>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} barGap={4}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => '₦' + (v / 1000).toFixed(0) + 'k'} />
                                <Tooltip formatter={(v) => fmt(v)} />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <div className="empty-state" style={{ padding: 40 }}><div className="empty-icon">📈</div><p>No data yet</p></div>}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card" style={{ marginTop: 24 }}>
                <div className="card-header">
                    <div className="card-title">Recent Transactions</div>
                    <Link to="/dashboard/history" className="btn btn-ghost btn-sm">View All</Link>
                </div>
                {recent.length === 0
                    ? <div className="empty-state" style={{ padding: 32 }}><div className="empty-icon">📂</div><p>No transactions yet. Add your first income or expense!</p></div>
                    : (
                        <>
                            <div className="table-wrapper">
                                <table>
                                    <thead><tr><th>Date</th><th>Category</th><th>Notes</th><th>Type</th><th>Amount</th></tr></thead>
                                    <tbody>
                                        {recent.map(t => (
                                            <tr key={t._id}>
                                                <td>{new Date(t.date).toLocaleDateString()}</td>
                                                <td>{t.category}</td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.note || t.source || '—'}</td>
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
                                {recent.map(t => (
                                    <div key={t._id} className="mobile-card">
                                        <div className="mobile-card-main">
                                            <div className="mobile-card-title">{t.category}</div>
                                            <div className="mobile-card-sub">{new Date(t.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="mobile-card-side">
                                            <div className="mobile-card-amount" style={{ color: t.type === 'income' ? 'var(--accent-dark)' : 'var(--danger)' }}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </div>
                                            <span className={`badge badge-${t.type}`} style={{ fontSize: 10 }}>{t.type}</span>
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
