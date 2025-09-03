import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Star, MessageSquare, Clock, ChevronRight, ThumbsUp } from 'lucide-react';
import moment from 'moment';
import Header from './Header';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust based on where you store the token
        const response = await fetch('https://bitebuddy-backend-6wwq.onrender.com/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`, // Add token here
          },
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();

        // Rest of your code...
        const enrichedData = await Promise.all(data.map(async (notif) => {
          if (notif.type === 'rating' && notif.order && notif.order.orderNumber) {
            const orderResponse = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/orders/${notif.order.orderNumber}`, {
              headers: {
                'Authorization': `Bearer ${token}`, // Add token here too
              },
            });
            if (orderResponse.ok) {
              const orderDetails = await orderResponse.json();
              return { ...notif, order: { ...notif.order, items: orderDetails.items || [] } };
            }
          }
          return notif;
        }));

        setNotifications(enrichedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const formatTime = (timestamp) => {
    return moment(timestamp).fromNow(); // e.g., "5 minutes ago"
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
  
      if (!notifications || notifications.length === 0) {
        console.log('No notifications to clear');
        return;
      }
  
      console.log('Clearing all notifications');
  
      // Single DELETE request to clear all notifications for the user
      const response = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`Failed to clear notifications: ${errorData.message || response.statusText}`);
      }
  
      // Clear the UI
      setNotifications([]);
      console.log('All notifications cleared successfully');
    } catch (err) {
      console.error('Error clearing notifications:', err.message);
      alert(`Failed to clear notifications: ${err.message}`);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Send DELETE request to backend
      const response = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`Failed to delete notification ${notificationId}: ${errorData.message || response.statusText}`);
      }

      // Update frontend state by removing the deleted notification
      setNotifications(notifications.filter(n => n.id !== notificationId));
      console.log(`Successfully deleted notification ${notificationId}`);
    } catch (err) {
      console.error('Error deleting notification:', err.message);
      alert(`Failed to delete notification: ${err.message}`);
    }
  };

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const getIcon = (type) => {
    switch (type) {
      case 'rating': return <Star className="text-warning" style={{ height: '1.25rem', width: '1.25rem' }} />;
      case 'order': return <Clock className="text-success" style={{ height: '1.25rem', width: '1.25rem' }} />;
      case 'promo': return <ThumbsUp className="text-primary" style={{ height: '1.25rem', width: '1.25rem' }} />;
      case 'feedback': return <MessageSquare className="text-purple" style={{ height: '1.25rem', width: '1.25rem' }} />;
      case 'menu': return <Star className="text-orange" style={{ height: '1.25rem', width: '1.25rem' }} />;
      default: return <Bell className="text-secondary" style={{ height: '1.25rem', width: '1.25rem' }} />;
    }
  };

  const RatingStars = ({ notificationId, order, onRate }) => {
    const [ratings, setRatings] = useState(() => {
      const savedRatings = localStorage.getItem(`ratings_${notificationId}`);
      return savedRatings ? JSON.parse(savedRatings) : {};
    });
    const [hovers, setHovers] = useState({});

    useEffect(() => {
      localStorage.setItem(`ratings_${notificationId}`, JSON.stringify(ratings));
    }, [ratings, notificationId]);

    const submitRating = async (itemId, ratingValue) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        // Store the rating in the Menu collection
        const rateResponse = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/menu/${itemId}/rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: ratingValue }),
        });
        if (!rateResponse.ok) throw new Error('Failed to submit rating');

        // Mark the notification as read after each rating
        const patchResponse = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/notifications/${notificationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ensure token is included
          },
          body: JSON.stringify({
            read: true, // Mark as read immediately
          }),
        });
        if (!patchResponse.ok) throw new Error('Failed to mark notification as read');

        // Check if all items are rated
        const allRated = order.orderItems.every(
          item => ratings[item._id] || (item._id === itemId && ratingValue)
        );

        // If all items are rated, update the description and call onRate
        if (allRated) {
          const finalPatchResponse = await fetch(`https://bitebuddy-backend-6wwq.onrender.com/api/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              action: 'none',
              description: `You rated Order #${order.orderNumber}`,
              read: true, // Ensure it stays read
            }),
          });
          if (!finalPatchResponse.ok) throw new Error('Failed to update notification description');
          onRate(ratings); // Call onRate only when all items are rated
        }
      } catch (err) {
        console.error('Error submitting rating:', err.message);
      }
    };

    return (
      <motion.div
        className="mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map(item => (
            <div key={item._id} className="d-flex align-items-center mb-2">
              <span className="me-2 text-secondary small">{item.name}</span>
              <div className="d-flex">
                {[...Array(5)].map((_, i) => {
                  const currentRating = ratings[item._id] || 0;
                  const currentHover = hovers[item._id] || 0;
                  const isActive = i < (currentHover || currentRating);

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        style={{
                          height: '1.25rem',
                          width: '1.25rem',
                          cursor: 'pointer',
                          color: isActive ? '#ffc107' : '#e2e2e2',
                          fill: isActive ? '#ffc107' : 'none',
                          transition: 'all 0.2s ease-in-out',
                        }}
                        onClick={() => {
                          const newRating = i + 1;
                          setRatings(prev => ({ ...prev, [item._id]: newRating }));
                          submitRating(item._id, newRating);
                        }}
                        onMouseEnter={() => setHovers(prev => ({ ...prev, [item._id]: i + 1 }))}
                        onMouseLeave={() => setHovers(prev => ({ ...prev, [item._id]: 0 }))}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-secondary small">No items to rate</p>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Header />
      <div style={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f3f6fb 100%)', minHeight: '100vh' }}>
        {loading && <div className="p-4 text-center">Loading notifications...</div>}
        {error && <div className="p-4 text-center text-danger">Error: {error}</div>}
        <div className="container-fluid py-5 px-3 px-md-5">
          <motion.div
            className="row justify-content-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-12 col-md-10 col-lg-8">
              <motion.div
                className="card border-0 shadow-lg rounded-4 overflow-hidden mx-auto"
                style={{ width: '90vw', maxWidth: '48rem' }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div
                  className="p-3 text-white"
                  style={{ background: "linear-gradient(45deg, #ff6b6b, #ff6262)" }}
                >
                  <h1 className="fw-bold text-white fs-4 mb-0">Notifications</h1>
                  <p className="text-white-60 small mb-0">Stay updated with your orders and promos</p>
                </div>

                <ul className="nav nav-tabs nav-fill">
                  {['all', 'unread', 'rating'].map(tab => (
                    <li key={tab} className="nav-item">
                      <motion.button
                        className={`nav-link ${activeTab === tab ? 'active fw-medium' : 'text-secondary'}`}
                        style={{ color: "black" }}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </motion.button>
                    </li>
                  ))}
                </ul>

                <div className="overflow-auto" style={{ maxHeight: '24rem', width: '100%' }}>
                  <AnimatePresence>
                    {filteredNotifications.length === 0 ? (
                      <motion.div
                        className="p-4 text-center text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        No notifications found
                      </motion.div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {filteredNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            className={`list-group-item ${notification.read ? '' : 'bg-light'}`}
                            onClick={() => markAsRead(notification.id)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ backgroundColor: '#f8f9fa' }}
                          >
                            <div className="d-flex align-items-start">
                              <motion.div
                                className="rounded-circle bg-light p-2 d-flex align-items-center justify-content-center me-3"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {getIcon(notification.type)}
                              </motion.div>
                              <div className="flex-grow-1">
                                <p className="mb-1 fw-medium small">{notification.title}</p>
                                <p className="mb-1 text-secondary small">{notification.description}</p>

                                {notification.type === 'rating' && notification.action === 'rate' && notification.order && (
                                  <RatingStars
                                    notificationId={notification.id}
                                    order={notification.order}
                                    onRate={(ratings) => {
                                      setNotifications(
                                        notifications.map(n =>
                                          n.id === notification.id
                                            ? {
                                              ...n,
                                              action: 'none',
                                              description: `You rated Order #${notification.order.orderNumber}`,
                                              read: true,
                                            }
                                            : n
                                        )
                                      );
                                    }}
                                  />
                                )}

                                <motion.div
                                  whileHover={{ scale: 1.2 }} // Pop-up effect on hover
                                  whileTap={{ scale: 0.9 }} // Slight shrink on click
                                  className="delete-icon"
                                  style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    cursor: 'pointer',
                                    color: '#dc3545', // Red color for delete
                                  }}
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  title="Delete notification"
                                >
                                  <i className="fa-solid fa-trash" /> {/* Font Awesome trash icon */}
                                </motion.div>


                                {notification.action === 'collect' && (
                                  <motion.span
                                    className="badge bg-success rounded-pill mt-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    Ready for pickup
                                  </motion.span>
                                )}

                                {notification.action === 'view' && (
                                  <motion.button
                                    className="btn btn-link btn-sm text-primary p-0 mt-2 d-flex align-items-center"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    View details
                                    <ChevronRight style={{ height: '0.75rem', width: '0.75rem', marginLeft: '0.25rem' }} />
                                  </motion.button>
                                )}

                                <p className="text-muted small mt-1 mb-0">{formatTime(notification.time)}</p>
                              </div>
                              {!notification.read && (
                                <motion.div
                                  className="bg-primary rounded-circle ms-2"
                                  style={{ width: '0.5rem', height: '0.5rem' }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  className="card-footer bg-light"
                  whileHover={{ backgroundColor: '#e9ecef' }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    className="btn w-100"
                    style={{ color: "white", background: "linear-gradient(45deg, #ff6b6b, #ff6262)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={clearAllNotifications}
                  >
                    Clear all messages
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default NotificationPage;
