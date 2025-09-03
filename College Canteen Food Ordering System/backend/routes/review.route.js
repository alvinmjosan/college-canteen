import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createRating, deleteRating, getRatings } from '../controllers/review.controller.js';
import requireAdmin from '../middleware/isAdmin.js';

const reviewRouter = express.Router();

reviewRouter.post('/ratings', authMiddleware, createRating);
reviewRouter.get('/ratings', authMiddleware, requireAdmin, getRatings);
reviewRouter.delete('/ratings/:id', authMiddleware, requireAdmin, deleteRating);

export default reviewRouter;