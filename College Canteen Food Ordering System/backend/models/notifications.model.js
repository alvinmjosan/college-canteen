import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        userId: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['rating', 'order', 'promo', 'feedback', 'menu'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        time: {
            type: Date, 
            default: Date.now,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        action: {
            type: String,
            required: true,
            enum: ['rate', 'collect', 'view', 'none'],
        },
        order: {
            type: mongoose.Schema.Types.ObjectId, // Reference to your Order model
            ref: 'orders', // Matches the model name in your orderModel
            required: function () { return this.type === 'rating' || this.type === 'feedback'; },
        }
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;