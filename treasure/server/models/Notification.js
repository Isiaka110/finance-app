import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, default: 'info' }, // info, success, warning
    link: { type: String } // optional link to related page
}, { timestamps: true });

export default mongoose.model('Notification', schema);
