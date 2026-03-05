import Transaction from '../models/Transaction.js';
import { createNotification } from './notificationController.js';


export const getTransactions = async (req, res) => {
    try {
        const rows = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
        res.json(rows);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const addTransaction = async (req, res) => {
    try {
        const { type, amount, category, source, date, note } = req.body;
        const tx = new Transaction({
            userId: req.userId,
            type,
            amount,
            category,
            source,
            date,
            note
        });
        await tx.save();
        await createNotification(req.userId, `New ${type.charAt(0).toUpperCase() + type.slice(1)} Added`, `You recorded a new ${type} of ₦${amount} for ${category}.`, type === 'income' ? 'success' : 'info', `/dashboard/${type}s`);
        res.status(201).json(tx);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateTransaction = async (req, res) => {
    try {
        const { type, amount, category, source, date, note } = req.body;
        const tx = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { type, amount, category, source, date, note },
            { new: true }
        );
        if (!tx) return res.status(404).json({ message: 'Transaction not found' });
        await createNotification(req.userId, `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} Updated`, `You updated your ${tx.type} entry for ${tx.category}.`, 'info', `/dashboard/${tx.type}s`);
        res.json(tx);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteTransaction = async (req, res) => {
    try {
        const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!tx) return res.status(404).json({ message: 'Transaction not found' });
        await createNotification(req.userId, `Transaction Deleted`, `You deleted a ${tx.type} of ₦${tx.amount}.`, 'warning');
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
