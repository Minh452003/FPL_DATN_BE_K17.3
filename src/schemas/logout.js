import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Tham chiếu đến model User
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;