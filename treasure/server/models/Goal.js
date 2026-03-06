import mongoose from 'mongoose';

const SavingsGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SavingsGoal || mongoose.model('SavingsGoal', SavingsGoalSchema);
