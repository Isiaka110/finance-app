import Goal from '../models/Goal.js';

export const getGoals = async (req, res) => {
    try {
        const rows = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(rows);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const addGoal = async (req, res) => {
    try {
        const { name, targetAmount } = req.body;
        const goal = new Goal({
            userId: req.userId,
            name,
            targetAmount
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (req.body.name !== undefined) goal.name = req.body.name;
        if (req.body.targetAmount !== undefined) goal.targetAmount = req.body.targetAmount;
        if (req.body.savedAmount !== undefined) goal.savedAmount = req.body.savedAmount;

        goal.completed = goal.savedAmount >= goal.targetAmount;

        await goal.save();
        res.json(goal);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
