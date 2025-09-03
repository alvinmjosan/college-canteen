import mongoose from "mongoose";

const orderScheme = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderNumber: { type: String, required: true },
        orderItems: [
            {
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        deliveryMethod: { type: String },
        deliveryAddress: { type: String },
        isStatus: { type: String, default: "processing" },
    },
    {
        timestamps: true
    }
);

const orderModel = mongoose.model("orders", orderScheme);
export default orderModel;