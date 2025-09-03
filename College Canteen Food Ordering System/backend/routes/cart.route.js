import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createCartItems, deleteCartItems, deleteSingleCartItem, getCartItems, updateCartItems } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/cart", authMiddleware, createCartItems);
cartRouter.get("/cart", authMiddleware, getCartItems);
cartRouter.patch("/cart/:itemId", authMiddleware, updateCartItems);
cartRouter.delete("/cart", authMiddleware, deleteCartItems);
cartRouter.delete("/cart/:itemId", authMiddleware, deleteSingleCartItem);

export default cartRouter;