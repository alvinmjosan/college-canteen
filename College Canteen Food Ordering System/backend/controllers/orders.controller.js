import orderModel from '../models/order.model.js';
import NotificationModel from '../models/notifications.model.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();

export const createOrders = async (req, res) => {
    try {
        const { userId, orderNumber, items, total, paymentMethod, deliveryMethod, deliveryAddress, isStatus } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Validate required fields
        if (!userId || !orderNumber || !items || !total || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = new orderModel({
            userId,
            orderNumber,
            orderItems: items,
            total,
            paymentMethod,
            deliveryMethod,
            deliveryAddress,
            isStatus
        });

        const savedOrder = await newOrder.save();

        if (newOrder.isStatus === 'processing') {
            const latestNotification = await NotificationModel.findOne().sort({ id: -1 });
            const newId = latestNotification ? latestNotification.id + 1 : 1;
            const ratingNotification = new NotificationModel({
                userId,
                id: newId,
                type: 'rating',
                title: 'Rate your last order',
                description: `${newOrder.orderItems.map(item => item.name).join(', ')} (Order #${newOrder.orderNumber})`,
                time: new Date(),
                read: false,
                action: 'rate',
                order: newOrder._id,
            });
            await ratingNotification.save();
        }

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 }); // Fetch orders for the user
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.isAdmin; // Assuming you have this in your JWT token

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        let orders;
        if (isAdmin) {
            // If admin, fetch all orders
            orders = await orderModel.find().sort({ createdAt: -1 });
        } else {
            // If regular user, fetch only their orders
            orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
        }
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rateOrderedItems = async (req, res) => {
    try {
      const { rating } = req.body;
      const order = await orderModel.findOne({ orderNumber: req.params.orderNumber, userId: req.user.userId });
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      const item = order.orderItems.find(item => item._id.toString() === req.params.itemId);
      if (!item) return res.status(404).json({ message: 'Item not found in order' });
  
      // Here you could save the rating to a separate collection or update the order
      res.json({ message: `Rated ${item.name} with ${rating} stars` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateStatusOfOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { isStatus } = req.body;

        if (!isStatus) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const order = await orderModel.findByIdAndUpdate(
            id,
            { 
                isStatus,
                updatedAt: new Date()
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete single order
export const deleteSingleOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Clear all orders
export const deleteOrders =  async (req, res) => {
    try {
        await orderModel.deleteMany({});
        res.status(200).json({ message: 'All orders cleared successfully' });
    } catch (error) {
        console.error('Error clearing orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};