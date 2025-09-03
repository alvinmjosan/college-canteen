import express from "express";
import { createMenu, deleteMenu, getMenu, menuRateUpdate, updateMenu } from "../controllers/menu.controller.js";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/isAdmin.js";

const menuRouter = express.Router();

menuRouter.get('/menu', getMenu);
menuRouter.post('/menu', authMiddleware, requireAdmin, createMenu);
menuRouter.post('/menu/:itemId/rate', authMiddleware, menuRateUpdate);
menuRouter.put('/menu/:id', authMiddleware, requireAdmin, updateMenu);
menuRouter.delete('/menu/:id', authMiddleware, requireAdmin, deleteMenu);

export default menuRouter;