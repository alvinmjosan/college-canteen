import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        selectedOption: {
            type: String,
            required: true
        },

        id: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        isAdmin: {
            type: Boolean,
            default: false 
        },
    }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;