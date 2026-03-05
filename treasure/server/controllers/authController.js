import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
