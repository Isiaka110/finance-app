import Transaction from '../models/Transaction.js';

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
        res.json(tx);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteTransaction = async (req, res) => {
    try {
        const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!tx) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
