import mongoose from "mongoose";

const menuSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            enum: ["lunch", "tea & Snacks", "refreshments"]
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        img: {
            type: String,
            required: true
        },
        ratings: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId, // Reference to the user who rated
                ref: "User", // Assuming you have a User model
            },
            value: {
                type: Number, 
                min: 1,
                max: 5, // Restrict to 1-5 star ratings
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
    },
    {
        timestamps: true
    }
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;