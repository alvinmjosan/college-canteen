import express from "express";
import authMiddleware from "../middleware/auth.js";
import { deleteNotifications, deleteSingleNotification, getNotifications, updateNotifications } from "../controllers/notifications.controller.js";

const notificationRouter = express.Router();

notificationRouter.get('/notifications', authMiddleware, getNotifications);
notificationRouter.patch('/notifications/:id', authMiddleware, updateNotifications);
notificationRouter.delete('/notifications/:id', authMiddleware, deleteSingleNotification);
notificationRouter.delete('/notifications', authMiddleware, deleteNotifications);

export default notificationRouter;