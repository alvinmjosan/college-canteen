import NotificationModel from '../models/notifications.model.js'
import dotenv from 'dotenv'

dotenv.config();

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await NotificationModel.find({ userId })
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotifications = async (req, res) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSingleNotification = async (req, res) => {
  try {
    const id = req.params.id;
    await NotificationModel.findOneAndDelete(parseInt(id));
    res.status(204).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await NotificationModel.deleteMany({ userId });
    if (result.deletedCount === 0) {
      console.log('No notifications found to delete');
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.status(204).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications' });
  }
};