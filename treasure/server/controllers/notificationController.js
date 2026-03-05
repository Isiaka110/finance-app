import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(notifs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createNotification = async (userId, title, message, type = 'info', link = '') => {
    try {
        await Notification.create({ userId, title, message, type, link });
    } catch (err) {
        console.error('Failed to create notification', err.message);
    }
};
