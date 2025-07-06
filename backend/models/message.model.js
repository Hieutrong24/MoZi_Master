import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'SenderId is required'
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'receiverId is required'
    },

    message: {
        type: String,
        required: 'Message is required'
    },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);