import express from "express";
import { changePassword, createProfile, deleteUser, forgetPassword, getUser, isUserAdmin, loginUser, signupUser, updateProfile, updateUserRole } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/isAdmin.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgetpassword", forgetPassword);
userRouter.post("/changepassword", changePassword);
userRouter.get("/profile", createProfile);
userRouter.put("/profile", updateProfile);
userRouter.put("/profile/:id", authMiddleware, requireAdmin, updateUserRole);
userRouter.delete("/profile/:id", authMiddleware, requireAdmin, deleteUser);
userRouter.get('/signup', authMiddleware, requireAdmin, getUser);
userRouter.get('/auth/me', authMiddleware, isUserAdmin);

export default userRouter;