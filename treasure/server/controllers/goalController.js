import Goal from '../models/Goal.js';
import { createNotification } from './notificationController.js';

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
        await createNotification(req.userId, 'New Savings Goal', `You created a new goal: "${name}" with target ₦${targetAmount}.`, 'success', '/dashboard/savings');
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

        const wasCompleted = goal.completed;
        goal.completed = goal.savedAmount >= goal.targetAmount;

        await goal.save();

        if (!wasCompleted && goal.completed) {
            await createNotification(req.userId, '🎉 Goal Completed!', `Congratulations! You reached your savings goal: "${goal.name}".`, 'success', '/dashboard/savings');
            if (req.body.excessAmt > 0) {
                await createNotification(req.userId, 'Extra Funds Available', `Your deposit exceeded the "${goal.name}" target by ₦${req.body.excessAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}. You can use the excess elsewhere!`, 'info', '/dashboard/savings');
            }
        } else if (req.body.savedAmount !== undefined && !goal.completed) {
            await createNotification(req.userId, 'Goal Progress', `You made a deposit towards "${goal.name}". Keep it up!`, 'info', '/dashboard/savings');
        } else if (req.body.name || req.body.targetAmount) {
            await createNotification(req.userId, 'Goal Updated', `You updated settings for "${goal.name}".`, 'info', '/dashboard/savings');
        }

        res.json(goal);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        await createNotification(req.userId, 'Goal Deleted', `You deleted the savings goal: "${goal.name}".`, 'warning', '/dashboard/savings');
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
