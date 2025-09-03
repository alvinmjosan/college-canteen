import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Utensils,
    Users,
    Trash2,
    Search,
    Plus,
    BarChart,
    Edit2,
    X,
    Trash,
} from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [menu, setMenu] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ _id: "", name: "", price: 0, category: "", description: "", img: "" });
    const [menuSearch, setMenuSearch] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [orderSearch, setOrderSearch] = useState("");
    const [activeSection, setActiveSection] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [ratings, setRatings] = useState([]);

    const api = axios.create({
        baseURL: 'https://bitebuddy-backend-6wwq.onrender.com/api',
    });

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const response = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            localStorage.removeItem('token');
            setUser(null);
            toast.error('Session expired. Please log in again.');
        }
    };

    // Single useEffect to handle all fetches
    useEffect(() => {
        const loadData = async () => {
            await fetchUserInfo(); // Wait for user info to load
        };
        loadData();
    }, []);

    // Fetch data only after user is loaded and is admin
    useEffect(() => {
        if (user === null) return; // Wait until user is set (null or object)
        if (!user.isAdmin) return; // Exit if not admin

        const fetchMenu = async () => {
            try {
                const response = await api.get('/menu', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setMenu(response.data);
            } catch (error) {
                toast.error('Failed to fetch menu items: ' + error.message);
            }
        };

        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to view users');
                return;
            }
            try {
                const response = await api.get('/signup', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setUsers([]);
                    toast.error('Invalid data format from server');
                }
            } catch (error) {
                console.error('Error fetching users:', error.response?.data || error.message);
                toast.error(error.response?.data?.message || 'Failed to fetch users');
            }
        };

        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to fetch orders');
                return;
            }
            try {
                const response = await api.get('/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const updatedOrders = response.data.map(order => ({
                    ...order,
                    total: calculateTotalAmount(order.total, order.deliveryMethod),
                }));
                setOrders(updatedOrders);
            } catch (error) {
                console.error('Fetch Orders Error:', error.response?.data || error.message);
                toast.error('Failed to fetch orders'); key
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await api.get('/ratings', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Assuming JWT auth
                });
                setRatings(response.data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        };

        fetchReviews();

        fetchMenu();
        fetchUsers();
        fetchOrders();
    }, [user]);


    const handleRemoveItem = async (id) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can delete menu items');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to delete menu items');
            return;
        }
        try {
            await api.delete(`/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMenu(menu.filter((item) => item._id !== id));
            toast.success('Menu item removed successfully!', { icon: '🗑️' });
        } catch (error) {
            toast.error('Failed to delete menu item');
            console.error('Delete Error:', error);
        }
    };

    const handleAddOrUpdateMenuItem = async () => {
        if (!user?.isAdmin) {
            toast.error('Only admins can add or update menu items');
            return;
        }
        if (!newMenuItem.name.trim() || !newMenuItem.category.trim() || !newMenuItem.description.trim() || !newMenuItem.img.trim()) {
            toast.error('Please fill in all fields to add or update a menu item');
            return;
        }
        const price = parseFloat(newMenuItem.price);
        if (isNaN(price) || price <= 0) {
            toast.error('Error: Price must be a valid number greater than 0.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add or update menu items');
            return;
        }
        try {
            if (newMenuItem._id) {
                console.log('Updating menu item:', newMenuItem);
                const response = await api.put(
                    `/menu/${newMenuItem._id}`,
                    { category: newMenuItem.category, name: newMenuItem.name, description: newMenuItem.description, price, img: newMenuItem.img },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMenu(menu.map((item) => (item._id === newMenuItem._id ? response.data : item)));
                toast.success('Menu item updated successfully!', { icon: '✏️' });
            } else {
                console.log('Adding new menu item:', newMenuItem);
                const response = await api.post(
                    '/menu',
                    { category: newMenuItem.category, name: newMenuItem.name, description: newMenuItem.description, price, img: newMenuItem.img },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMenu([...menu, response.data]);
                toast.success('Menu item added successfully!', { icon: '🍽️' });
            }
            setNewMenuItem({ _id: null, name: '', price: '', category: '', description: '', img: '' });
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error(error.response?.data?.error || 'Failed to save menu item');
        }
    };

    const handleEditMenuItem = (item) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can edit menu items');
            return;
        }
        console.log('Editing menu item:', item);
        setNewMenuItem({
            _id: item._id || null,
            name: item.name || '',
            price: item.price ? item.price.toString() : '',
            category: item.category || '',
            description: item.description || '',
            img: item.img || '',
        });
    };

    const handleEditUser = async (id, newRole) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can edit user roles');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to edit user roles');
            return;
        }
        try {
            const response = await api.put(
                `/profile/${id}`,
                { selectedOption: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map((user) => (user._id === id ? { ...user, selectedOption: response.data.role } : user)));
            toast.success(`User role updated to ${response.data.role}`, { icon: '👤' });
        } catch (error) {
            console.error('Error updating user role:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleRemoveUser = async (id) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can remove users');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to remove users');
            return;
        }
        try {
            await api.delete(`/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== id));
            toast.success('User removed successfully!', { icon: '🗑️' });
        } catch (error) {
            console.error('Error removing user:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to remove user');
        }
    };

    const calculateTotalAmount = (baseTotal, isDelivery) => {
        const gstRate = 0.06;
        const deliveryFee = 1.99;
        const gstAmount = baseTotal * gstRate;
        const totalWithGst = baseTotal + gstAmount;
        return isDelivery === 'delivery' ? (totalWithGst + deliveryFee).toFixed(2) : totalWithGst.toFixed(2);
    };

    const handleUpdateOrderStatus = async (id, newStatus) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can update order status');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to update orders');
            return;
        }
        try {
            console.log('Updating order:', id, 'with status:', newStatus);
            const response = await api.put(
                `/orders/${id}/status`,
                { isStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(orders.map((order) => (order._id === id ? response.data : order)));
            toast.success(`Order status updated to ${newStatus}`, { icon: '📦' });
        } catch (error) {
            console.error('Update Order Error:', error.response?.data || error.message);
            toast.error('Failed to update order status');
        }
    };

    const handleRemoveOrder = async (id) => {
        if (!user?.isAdmin) {
            toast.error('Only admins can remove orders');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to remove orders');
            return;
        }
        try {
            await api.delete(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(orders.filter((order) => order._id !== id));
            toast.success('Order removed successfully!', { icon: '🗑️' });
        } catch (error) {
            console.error('Error removing order:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to remove order');
        }
    };

    const handleClearAllOrders = async () => {
        if (!user?.isAdmin) {
            toast.error('Only admins can clear orders');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to clear orders');
            return;
        }
        try {
            await api.delete('/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders([]);
            setShowClearConfirm(false);
            toast.success('All orders cleared successfully!', { icon: '🧹' });
        } catch (error) {
            console.error('Error clearing orders:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to clear orders');
        }
    };

    const handleDeleteReview = async (reviewId) => {
    
        try {
          await api.delete(`/ratings/${reviewId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setRatings(ratings.filter((rating) => rating._id !== reviewId));
        } catch (err) {
          console.error('Error deleting review:', err);
          alert('Failed to delete review');
        }
      };

    const filteredMenu = menu.filter((item) => item.name.toLowerCase().includes(menuSearch.toLowerCase()));
    const filteredUsers = users.filter((user) =>
        user.id.includes(userSearch) || user.name.toLowerCase().includes(userSearch.toLowerCase())
    );
    const filteredOrders = orders.filter((order) =>
        order.orderNumber.includes(orderSearch) ||
        order.orderItems.some((item) => item.name.toLowerCase().includes(orderSearch.toLowerCase()))
    );

    if (!user) {
        return <div>Loading...</div>;
    }

    if (!user.isAdmin) {
        return <div>You do not have permission to access this page.</div>;
    }

    // Animation variants (unchanged)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2 }
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            transition: { duration: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        },
        tap: { scale: 0.95 }
    };

    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        }
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "cancelled":
                return "bg-danger-subtle text-danger";
            case "processing":
                return "bg-warning-subtle text-warning";
            case "completed":
                return "bg-success-subtle text-success";
            default:
                return "bg-warning-subtle text-warning";
        }
    };

    return (
        <>
            <div>
                <div className="bg-light py-2">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <small>📍 GCE Kannur, Kerala, India | ✉️ gcek@canteen.com</small>
                            </div>
                            <div className="col-md-6 text-end">
                                <small>Follow us:
                                    <a href="/" className="text-dark mx-1">
                                        <i className="fab fa-facebook-square" style={{ color: "#4008d9" }}></i>
                                    </a>
                                    <a href="/" className="text-dark mx-1">
                                        <i className="fab fa-instagram-square" style={{ color: "#e61e6e" }}></i>
                                    </a>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
                    <div className="container">
                        <a href="/home" className="navbar-brand fw-bold">
                            <span style={{ color: "black" }}>𝘽𝙞𝙩𝙚</span>
                            <span style={{ color: "#f84949" }}>𝘽𝙪𝙙𝙙𝙮</span>
                        </a>
                    </div>
                </nav>
            </div>
            <motion.div
                className="min-vh-100 bg-light p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="d-flex justify-content-between align-items-center mb-4"
                    >
                        <h1 className="h3 text-dark d-flex align-items-center">
                            <motion.div
                                initial={{ rotate: -10, scale: 0.9 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15,
                                    delay: 0.2
                                }}
                            >
                                <BarChart className="me-3 text-primary" />
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Admin Dashboard
                            </motion.span>
                        </h1>
                    </motion.div>

                    <motion.div
                        className="row g-4 mb-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {[
                            { title: "Total Menu", value: menu.length, icon: <Utensils className="text-primary" />, color: "bg-primary-subtle" },
                            { title: "Total Users", value: users.length, icon: <Users className="text-success" />, color: "bg-success-subtle" },
                            { title: "Total Orders", value: orders.length, icon: <Utensils className="text-warning" />, color: "bg-warning-subtle" },
                        ].map((stat, idx) => (
                            <div key={idx} className="col-md-4">
                                <motion.div
                                    variants={cardVariants}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        transition: { duration: 0.2 }
                                    }}
                                    className={`${stat.color} p-4 rounded-3 shadow-sm d-flex align-items-center`}
                                >
                                    <motion.div
                                        className="p-2 rounded-circle bg-white shadow me-3"
                                        whileHover={{ rotate: 5 }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                            delay: 0.1 * idx
                                        }}
                                    >
                                        {stat.icon}
                                    </motion.div>
                                    <div>
                                        <motion.p
                                            className="text-muted mb-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 + (0.1 * idx) }}
                                        >
                                            {stat.title}
                                        </motion.p>
                                        <motion.h2
                                            className="h4 mb-0"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: 0.3 + (0.1 * idx),
                                                    type: "spring",
                                                    stiffness: 200
                                                }
                                            }}
                                        >
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + (0.1 * idx),
                                                    duration: 0.8
                                                }}
                                            >
                                                {stat.value}
                                            </motion.span>
                                        </motion.h2>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                                className="card overflow-hidden"
                                layoutId="menu-card"
                                transition={{ layout: { duration: 0.3 } }}
                                onHoverStart={() => setActiveSection("menu")}
                                onHoverEnd={() => setActiveSection(null)}
                            >
                                <motion.div
                                    className="card-header d-flex align-items-center"
                                    initial={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                                    whileHover={{
                                        borderBottom: "1px solid rgba(0,0,0,0.2)",
                                        backgroundColor: "rgba(0,0,0,0.02)"
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Utensils className="me-3 text-primary" />
                                    </motion.div>
                                    <h5 className="mb-0">Manage Menu</h5>
                                </motion.div>

                                <div className="card-body">
                                    <motion.div
                                        className="input-group mb-3"
                                        variants={inputVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <span className="input-group-text">
                                            <Search size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Menu"
                                            value={menuSearch}
                                            onChange={(e) => setMenuSearch(e.target.value)}
                                        />
                                        <motion.button
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            onClick={handleAddOrUpdateMenuItem}
                                            className="btn btn-primary d-flex align-items-center"
                                        >
                                            <Plus />
                                            {newMenuItem._id ? ' Update' : ' Add'} {/* Dynamic button text */}
                                        </motion.button>
                                    </motion.div>

                                    <motion.div
                                        className="row g-2 mb-3"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {[
                                            { placeholder: "Name", value: newMenuItem.name, field: "name" },
                                            { placeholder: "Price", value: newMenuItem.price, field: "price", type: "number" },
                                            { placeholder: "Description", value: newMenuItem.description, field: "description" },
                                            { placeholder: "Image URL (e.g., https://example.com/image.jpg)", value: newMenuItem.img, field: "img", type: "url" }
                                        ].map((input, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="col-6"
                                                variants={fadeInVariants}
                                                transition={{ delay: 0.1 * idx }}
                                            >
                                                <motion.input
                                                    type={input.type || "text"}
                                                    className="form-control"
                                                    placeholder={input.placeholder}
                                                    value={input.value}
                                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, [input.field]: e.target.value })}
                                                    whileFocus={{
                                                        boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                                        borderColor: "#86b7fe"
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                        {/* Category Dropdown */}
                                        <motion.div
                                            className="col-6"
                                            variants={fadeInVariants}
                                            transition={{ delay: 0.1 * 2 }} // Adjust delay to fit sequence
                                        >
                                            <motion.select
                                                className="form-select"
                                                value={newMenuItem.category}
                                                onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                                                whileFocus={{
                                                    boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                                    borderColor: "#86b7fe"
                                                }}
                                            >
                                                <option value="" disabled>Select Category</option>
                                                <option value="lunch">Lunch</option>
                                                <option value="tea & Snacks">Tea & Snacks</option>
                                                <option value="refreshments">Refreshments</option>
                                            </motion.select>
                                        </motion.div>
                                    </motion.div>

                                    <LayoutGroup>
                                        <motion.div layout>
                                            <AnimatePresence>
                                                {filteredMenu.map((item, index) => (
                                                    <motion.div
                                                        key={item._id}
                                                        layout
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        whileHover="hover"
                                                        className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-2 shadow-sm"
                                                        custom={index}
                                                        transition={{
                                                            layout: { duration: 0.3 },
                                                            delay: index * 0.05
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-start mb-3">
                                                            <img
                                                                src={item.img}
                                                                alt={item.name}
                                                                className="me-3 rounded"
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                whileHover={{
                                                                    scale: 1.05,
                                                                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                                                                }}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            />
                                                            <div>
                                                                <motion.p
                                                                    className="fw-bold mb-1"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.1 }}
                                                                >
                                                                    {item.name}
                                                                </motion.p>
                                                                <motion.p
                                                                    className="text-muted small mb-1"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.2 }}
                                                                >
                                                                    ₹{item.price} - {item.category}
                                                                </motion.p>
                                                                <motion.p
                                                                    className="text-muted small mb-0"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.3 }}
                                                                >
                                                                    {item.description}
                                                                </motion.p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            <motion.button
                                                                onClick={() => handleEditMenuItem(item)}
                                                                className="btn btn-outline-primary btn-sm me-2"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Edit2 size={16} />
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => handleRemoveItem(item._id)}
                                                                className="btn btn-outline-danger btn-sm"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    </LayoutGroup>
                                </div>
                            </motion.div>
                        </div>

                        <div className="col-md-6">
                            <motion.div
                                className="card p-4 mb-4" // Match the boxed style of other containers
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                style={{
                                    backgroundColor: '#fff',    
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                }}
                            >
                                <h2 className="mb-4"><i class="fa-solid fa-star" style={{ color: "#FFD700" }}
                                ></i>  User Reviews</h2>
                                {ratings.length === 0 ? (
                                    <p className="text-muted">No reviews available.</p>
                                ) : (
                                    <AnimatePresence>
                                        {ratings.map((rating, index) => (
                                            <motion.div
                                                key={rating._id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                whileHover="hover"
                                                className="d-flex justify-content-between align-items-start bg-light p-3 rounded mb-3 shadow-sm"
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div>
                                                    <motion.p
                                                        className="fw-bold mb-1"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        {rating.userId?.name || 'Anonymous'}
                                                    </motion.p>
                                                    <motion.p
                                                        className="text-muted mb-1"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        {rating.review}
                                                    </motion.p>
                                                    <motion.p
                                                        className="text-muted small mb-0"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        Submitted: {new Date(rating.createdAt).toLocaleString()}
                                                    </motion.p>
                                                </div>
                                                <motion.button
                                                    onClick={() => handleDeleteReview(rating._id)}
                                                    className="btn btn-outline-danger btn-sm"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 size={16} />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                            {[
                                {
                                    title: "Manage Orders",
                                    items: filteredOrders,
                                    setSearch: setOrderSearch,
                                    search: orderSearch,
                                    handler: handleUpdateOrderStatus,
                                    key: "isStatus",
                                    options: ["Cancelled", "Processing", "Completed"],
                                    icon: <Utensils className="me-3 text-success" />,
                                    details: (order) => (
                                        <>
                                            <motion.p
                                                className="text-muted small mb-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                Order # {order.orderNumber}
                                            </motion.p>
                                            <motion.p
                                                className="text-muted small mb-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Total: ₹{order.total}
                                            </motion.p>
                                            <motion.p
                                                className="text-muted small mb-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                Payment: {order.paymentMethod}
                                            </motion.p>
                                            {order.deliveryMethod && (
                                                <motion.p
                                                    className="text-muted small mb-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    Delivery: {order.deliveryMethod}
                                                </motion.p>
                                            )}
                                            {order.deliveryAddress && (
                                                <motion.p
                                                    className="text-muted small mb-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    Address: {order.deliveryAddress}
                                                </motion.p>
                                            )}
                                            <motion.ul
                                                className="mt-2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                {order.orderItems.map((item, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        className="text-muted small"
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.7 + (idx * 0.1) }}
                                                    >
                                                        {item.name} - ₹{item.price} x {item.quantity}
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        </>
                                    ),
                                    statusBadge: (item) => (
                                        <motion.span
                                            className={`badge ${getStatusStyle(item.isStatus)} px-2 py-1 rounded-pill`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {item.isStatus}
                                        </motion.span>
                                    )
                                },
                                {
                                    title: "Manage Users",
                                    items: filteredUsers,
                                    setSearch: setUserSearch,
                                    search: userSearch,
                                    handler: handleEditUser,
                                    key: "selectedOption",
                                    options: ["Student", "Faculty"],
                                    icon: <Users className="me-3 text-warning" />,
                                    details: (user) => (
                                        <>
                                            <motion.p
                                                className="text-muted small mb-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                Email: {user.email}
                                            </motion.p>
                                            <motion.p
                                                className="text-muted small mb-0"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                User ID: {user.id}
                                            </motion.p>
                                        </>
                                    ),
                                    statusBadge: (item) => (
                                        <motion.span
                                            className={`badge ${item.selectedOption === "Student" ? "bg-info-subtle text-info" : "bg-warning-subtle text-warning"} px-2 py-1 rounded-pill`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {item.selectedOption}
                                        </motion.span>
                                    )
                                },
                            ].map((section, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                                    className="card overflow-hidden mb-4"
                                    layoutId={`card-${idx}`}
                                    transition={{ layout: { duration: 0.3 } }}
                                    onHoverStart={() => setActiveSection(idx)}
                                    onHoverEnd={() => setActiveSection(null)}
                                >
                                    <motion.div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        initial={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                                        whileHover={{
                                            borderBottom: "1px solid rgba(0,0,0,0.2)",
                                            backgroundColor: "rgba(0,0,0,0.02)"
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <motion.div
                                                whileHover={{ rotate: 10 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                {section.icon}
                                            </motion.div>
                                            <h5 className="mb-0">{section.title}</h5>
                                        </div>
                                        {section.title === "Manage Orders" && (
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => setShowClearConfirm(true)}
                                                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                            >
                                                <Trash size={16} className="me-1" />
                                                Clear All
                                            </motion.button>
                                        )}
                                    </motion.div>

                                    <div className="card-body">
                                        <motion.div
                                            className="input-group mb-3"
                                            variants={inputVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <span className="input-group-text">
                                                <Search size={18} />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Search ${section.title.split(" ")[1]}`}
                                                value={section.search}
                                                onChange={(e) => section.setSearch(e.target.value)}
                                            />
                                        </motion.div>

                                        <LayoutGroup>
                                            <motion.div layout>
                                                <AnimatePresence>
                                                    {section.items.map((item, index) => (
                                                        <motion.div
                                                            key={item._id}
                                                            layout
                                                            variants={itemVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            whileHover="hover"
                                                            className="d-flex justify-content-between align-items-start bg-light p-3 rounded mb-2 shadow-sm"
                                                            custom={index}
                                                            transition={{
                                                                layout: { duration: 0.3 },
                                                                delay: index * 0.05
                                                            }}
                                                        >
                                                            <div className="d-flex flex-column">
                                                                <motion.p
                                                                    className="fw-bold mb-1"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.1 }}
                                                                >
                                                                    {section.title === "Manage Users" ? item.name : item.orderItems[0].name + (item.orderItems.length > 1 ? ` + ${item.orderItems.length - 1} more` : '')}
                                                                </motion.p>
                                                                {section.details(item)}
                                                            </div>
                                                            <div className="d-flex flex-column align-items-end">
                                                                {section.statusBadge(item)}
                                                                <div className="mt-2">
                                                                    {section.options && (
                                                                        <motion.select
                                                                            className="form-select form-select-sm me-2 mb-2"
                                                                            value={item[section.key]}
                                                                            onChange={(e) => section.handler(item._id, e.target.value)}
                                                                            whileFocus={{
                                                                                boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                                                                borderColor: "#86b7fe"
                                                                            }}
                                                                            initial={{ opacity: 0, y: 5 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: 0.4 }}
                                                                        >
                                                                            {section.options.map((option) => (
                                                                                <option key={option} value={option.toLowerCase()}>
                                                                                    {option}
                                                                                </option>
                                                                            ))}
                                                                        </motion.select>
                                                                    )}
                                                                    <motion.button
                                                                        onClick={() => section.title === "Manage Users" ? handleRemoveUser(item._id) : handleRemoveOrder(item._id)}
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: 0.5 }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </motion.div>
                                        </LayoutGroup>

                                        {section.items.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="text-center py-4 text-muted"
                                            >
                                                <p className="mb-0">No {section.title.split(" ")[1].toLowerCase()} found</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Confirmation Modal for Clearing Orders */}
            <AnimatePresence>
                {showClearConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                        onClick={() => setShowClearConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white p-4 rounded-3 shadow-lg"
                            style={{ maxWidth: "400px", width: "90%" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Clear All Orders</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowClearConfirm(false)}
                                ></button>
                            </div>
                            <p>Are you sure you want to clear all orders? This action cannot be undone.</p>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowClearConfirm(false)}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-danger"
                                    onClick={handleClearAllOrders}
                                >
                                    Clear All
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminDashboard;
