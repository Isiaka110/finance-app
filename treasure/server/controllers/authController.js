import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const SECRET = process.env.JWT_SECRET || 'finance_secret';

export const register = async (req, res) => {
    try {
        const { fullName, emailOrPhone, password } = req.body;
        if (!fullName || !emailOrPhone || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const existing = await User.findOne({ emailOrPhone });
        if (existing) return res.status(400).json({ message: 'User already exists with this email/phone' });

        const hashed = bcrypt.hashSync(password, 12);
        const user = new User({ fullName, emailOrPhone, password: hashed });
        await user.save();

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, fullName, emailOrPhone }, isNew: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const user = await User.findOne({ emailOrPhone });
        if (!user) return res.status(404).json({ message: 'No account found with that email/phone' });

        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, fullName: user.fullName, emailOrPhone: user.emailOrPhone }, isNew: false });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, emailOrPhone, password } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (emailOrPhone && emailOrPhone !== user.emailOrPhone) {
            const existing = await User.findOne({ emailOrPhone });
            if (existing) return res.status(400).json({ message: 'Email/Phone already in use' });
            user.emailOrPhone = emailOrPhone;
        }

        if (fullName) user.fullName = fullName;
        if (password) user.password = bcrypt.hashSync(password, 12);

        await user.save();
        res.json({ success: true, user: { id: user._id, fullName: user.fullName, emailOrPhone: user.emailOrPhone } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Cleanup associated data - these models should be imported if not already
        // For now, these are the core models
        await mongoose.model('Transaction').deleteMany({ userId: req.userId });
        await mongoose.model('SavingsGoal').deleteMany({ userId: req.userId });

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
