import Cart from "../models/cart.model.js";
import dotenv from 'dotenv'
import userModel from "../models/user.model.js";

dotenv.config();

export const createCartItems = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { items } = req.body;
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items must be a non-empty array" });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        cart.items = items; 
        await cart.save();
      } else {
        cart = new Cart({
          userId,
          items,
        });
        await cart.save();
      }
  
      res.status(200).json({
        message: "Cart updated successfully",
        cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const getCartItems = async (req, res) => {
    try {
      const userId = req.user.userId;
      const cart = await Cart.findOne({ userId }); // Fixed: Use findOne instead of find
  
      if (!cart) {
        return res.status(200).json({ cart: { items: [] } }); // Consistent structure
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const updateCartItems = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
      const { change } = req.body; 
  
      if (!change || ![-1, 1].includes(change)) {
        return res.status(400).json({ message: 'Invalid change value. Use 1 or -1' });
      }
  
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      const newQuantity = cart.items[itemIndex].quantity + change;
      
      if (newQuantity <= 0) {
        // Remove item if quantity would be 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = newQuantity;
      }
  
      await cart.save();
  
      return res.status(200).json({ 
        message: 'Cart updated',
        cart 
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

export const deleteCartItems = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const cart = await Cart.deleteOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      return res.status(200).json({ 
        message: 'Cart cleared successfully',
        cart 
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

export const deleteSingleCartItem = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params;
  
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Filter out the item
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);
      await cart.save();
  
      return res.status(200).json({ 
        message: 'Item removed from cart',
        cart 
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };