import Rating from '../models/review.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const createRating = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const { review } = req.body;
      if (!review || !review.trim()) {
        return res.status(400).json({ message: 'Review is required' });
      }
  
      let existingRating = await Rating.findOne({ userId });
  
      if (existingRating) {
        existingRating.review = review;
        existingRating.createdAt = Date.now(); // Update timestamp
        await existingRating.save();
  
        res.status(200).json({
          message: 'Review updated successfully',
          rating: existingRating,
        });
      } else {
        const newRating = new Rating({
          userId,
          review,
        });
        await newRating.save();
  
        res.status(201).json({
          message: 'Review submitted successfully',
          rating: newRating,
        });
      }
    } catch (error) {
      console.error('Error submitting/updating review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByIdAndDelete(id);

    if (!rating) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};