import express from "express";
import { createOrders, deleteOrders, deleteSingleOrder, getAllOrders, getOrders, rateOrderedItems, updateStatusOfOrder } from "../controllers/orders.controller.js";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/isAdmin.js";

const ordersRouter = express.Router();

ordersRouter.post("/orders", createOrders);
ordersRouter.get("/orders", authMiddleware, getOrders);
ordersRouter.post("/orders/:orderNumber/rate/:itemId", authMiddleware, rateOrderedItems);
ordersRouter.put("/orders/:id/status", authMiddleware, requireAdmin, updateStatusOfOrder);
ordersRouter.delete("/orders/:id", authMiddleware, requireAdmin, deleteSingleOrder);
ordersRouter.delete("/orders", authMiddleware, requireAdmin, deleteOrders);
ordersRouter.get("/admin/orders", authMiddleware, requireAdmin, getAllOrders);

export default ordersRouter;