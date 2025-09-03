import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0a7bfe960cec0b",
        pass: "62de3355236902"
    }
});

export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json("Invalid email");
        }

        const passwordIsMatch = await bcrypt.compare(password, user.password);
        if (!passwordIsMatch) {
            return res.status(400).json("Password is incorrect");
        }

        const token = jwt.sign({ userId: user._id, username: user.name, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1hr" });
        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                selectUser: user.selectedOption,
                id: user.id
            },

        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signupUser = async (req, res) => {  

    try {
        const { name, email, selectedOption, id, password } = req.body;

        if (!name || !email || !selectedOption || !id || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingEmail = await userModel.findOne({ email });
        const existingId = await userModel.findOne({ id });

        if (existingEmail) {
            return res.status(409).json({ message: "Email already in use" });
        }

        if (existingId) {
            return res.status(409).json({ message: "ID already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const User = new userModel({
            name,
            email,
            selectedOption,
            id,
            password: hashedPassword
        });

        console.log(User);
        const user = await userModel.create(User);
        return res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json("Invalid email");
        }

        const tempPassword = crypto.randomBytes(6).toString("hex");

        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const mailText = {
            from: "0a7bfe960cec0b",
            to: email,
            subject: "Your temporary password",
            text: `Your temporary password is ${tempPassword}\n\nPlease log In and change it`
        };

        await transporter.sendMail(mailText);
        res.status(200).json({ message: "Temorary password sent successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser =  async (req, res) => {
    try {
        const users = await userModel.find().select('-password'); // Fetch all users
        res.status(200).json(users || []); // Return array, empty if no users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

        const token = authHeader.split(" ")[1]; // Extract token without "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("-password");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole =  async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedOption } = req.body;

        if (!selectedOption) {
            return res.status(400).json({ error: 'Role is required' });
        }

        const user = await userModel.findByIdAndUpdate(
            id,
            { selectedOption, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

        const token = authHeader.split(" ")[1]; // Extract token without "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { currentPassword, newPassword } = req.body;
        const passwordIsMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordIsMatch) {
            return res.status(400).json("Password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json("Password changed successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        // Extract token and verify user
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

        const token = authHeader.split(" ")[1]; // Remove "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const existingUser = await userModel.findById(decoded.userId);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the new email is already taken by another user
        if (req.body.email !== existingUser.email) {
            const emailExists = await userModel.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(409).json({ message: "user already existed" });
            }
        }
        // Check if the new Id is already taken by another user
        if (req.body.id !== existingUser.id) {
            const idExists = await userModel.findOne({ id: req.body.id });
            if (idExists) {
                return res.status(409).json({ message: "user already existed" });
            }
        }

        // Find the user by ID and update their details
        const updatedUser = await userModel.findByIdAndUpdate(
            decoded.userId,
            {
                name: req.body.name,
                email: req.body.email,
                id: req.body.id,
            },
            { new: true, select: "-password" } // Return updated user without password
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isUserAdmin = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: "Invalid or missing user ID", details: req.user.userId });
        }

        const user = await userModel.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found", userId: req.user.userId });
        }

        res.status(200).json({
            id: user._id,
            username: user.name,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


