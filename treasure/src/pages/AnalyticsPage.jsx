import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
    LineChart, Line
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const fmt = (n) => '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

export default function AnalyticsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/transactions').then(r => setTransactions(r.data)).finally(() => setLoading(false));
    }, []);

    // Expense by category (pie)
    const expenseByCat = transactions
        .filter(t => t.type === 'expense')
        .reduce((a, t) => { a[t.category] = (a[t.category] || 0) + t.amount; return a; }, {});
    const pieData = Object.entries(expenseByCat).map(([name, value]) => ({ name, value }));

    // Monthly income vs expense (bar)
    const monthlyMap = {};
    transactions.forEach(t => {
        const m = t.date?.slice(0, 7);
        if (!m) return;
        if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expense: 0 };
        monthlyMap[m][t.type] += t.amount;
    });
    const barData = Object.values(monthlyMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(m => ({ ...m, label: new Date(m.month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }) }));

    // Monthly balance trend (line)
    let running = 0;
    const lineData = barData.map(m => {
        running += m.income - m.expense;
        return { label: m.label, balance: +running.toFixed(2) };
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const topCategory = pieData.sort((a, b) => b.value - a.value)[0];

    if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading analytics...</p></div>;

    if (!transactions.length) return (
        <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Analytics</h1>
            <div className="empty-state"><div className="empty-icon">📈</div><p>Add some transactions to see analytics.</p></div>
        </div>
    );

    return (
        <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Analytics</h1>

            {/* Summary row */}
            <div className="stat-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card income"><div className="stat-label">Total Income</div><div className="stat-value green">{fmt(totalIncome)}</div></div>
                <div className="stat-card expense"><div className="stat-label">Total Expenses</div><div className="stat-value red">{fmt(totalExp)}</div></div>
                <div className="stat-card balance"><div className="stat-label">Net Balance</div><div className={`stat-value ${totalIncome - totalExp >= 0 ? 'blue' : 'red'}`}>{fmt(totalIncome - totalExp)}</div></div>
                {topCategory && <div className="stat-card savings"><div className="stat-label">Top Expense</div><div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginTop: 4 }}>{topCategory.name}</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{fmt(topCategory.value)}</div></div>}
            </div>

            {/* Pie chart */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">📊 Expense Distribution</div>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={v => fmt(v)} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className="empty-state"><p>No expenses yet</p></div>}
                </div>

                {/* Bar chart */}
                <div className="chart-card">
                    <div className="chart-title">📅 Income vs Expenses by Month</div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => '₦' + (v / 1000).toFixed(0) + 'k'} />
                            <Tooltip formatter={v => fmt(v)} />
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Line chart — trend */}
            <div className="chart-card" style={{ marginTop: 20 }}>
                <div className="chart-title">📈 Monthly Balance Trend</div>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={v => '₦' + (v / 1000).toFixed(0) + 'k'} />
                        <Tooltip formatter={v => fmt(v)} />
                        <Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} name="Balance" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
