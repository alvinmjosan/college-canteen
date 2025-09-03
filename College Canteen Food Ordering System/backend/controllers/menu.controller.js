import dotenv from 'dotenv';
import Menu from '../models/menu.model.js';

dotenv.config();

export const getMenu = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { category, name, description, price, img } = req.body;

        if (!category || !name || !description || !price || !img) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newItem = new Menu({
            category,
            name,
            description,
            price,
            img
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMenu =  async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, description, price, img } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        error: 'Name, price, and category are required fields'
      });
    }

    // Find and update the menu item
    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      {
        category,
        name,
        description,
        price: Number(price), // Ensure price is stored as a number
        img,
        updatedAt: new Date()
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validators
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        error: 'Menu item not found'
      });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const deleteMenu =  async (req, res) => {
  try {
      const { id } = req.params;
      const deletedItem = await Menu.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ message: 'Menu item not found' });
      }

      res.json({ message: 'Menu item deleted successfully', id });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

export const menuRateUpdate = async (req, res) => {
    try {
      const { itemId } = req.params;
      const { rating } = req.body;
      const userId = req.user.userId;
  
      // Find the menu item
      const menuItem = await Menu.findById(itemId);
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
  
      // Check if user already rated this item
      const existingRatingIndex = menuItem.ratings.findIndex(
        rating => rating.userId.toString() === userId
      );
  
      if (existingRatingIndex !== -1) {
        // Update existing rating
        menuItem.ratings[existingRatingIndex].value = rating;
      } else {
        // Add new rating
        menuItem.ratings.push({ userId, value: rating });
      }
  
      await menuItem.save();
      res.json({
        message: 'Rating submitted successfully',
        rating: {
          userId,
          value: rating
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }