import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = () => {
        API.get('/notifications')
            .then(res => setNotifications(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
        // Mark as read when entering page
        API.put('/notifications/read').catch(console.error);
    }, []);

    const ICONS = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️'
    };

    if (loading) return <div className="empty-state">⏳ Loading notifications...</div>;

    return (
        <div className="page-wrapper">
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Notifications</h1>

            <div className="card">
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {notifications.map(n => (
                            <div
                                key={n._id}
                                className={`mobile-card ${!n.read ? 'unread' : ''}`}
                                style={{
                                    cursor: n.link ? 'pointer' : 'default',
                                    borderLeft: !n.read ? '3px solid var(--accent-dark)' : 'none',
                                    paddingLeft: !n.read ? 13 : 16
                                }}
                                onClick={() => n.link && navigate(n.link)}
                            >
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: 20 }}>{ICONS[n.type] || '🔔'}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontWeight: !n.read ? 700 : 500, fontSize: 14 }}>{n.title}</h4>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{n.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
