import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import "../Authentication/logSignUp.css";


const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        selectUser: '', // 'student' or 'faculty'
        id: '', // student ID or faculty ID
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [editProfileData, setEditProfileData] = useState({
        name: '',
        email: '',
        id: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdminHovered, setIsAdminHovered] = useState(false);
    const [isNotificationHovered, setIsNotificationHovered] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://bitebuddy-backend-6wwq.onrender.com/api/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch notifications');
                const data = await response.json();
                setNotifications(data);
                // Count unread notifications
                const unread = data.filter(n => !n.read).length;
                setUnreadCount(unread);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchNotifications();
    }, []);

    const addNotification = (newNotification) => {
        setNotifications(prev => [...prev, newNotification]);
        if (!newNotification.read) {
            setUnreadCount(prev => prev + 1); // Increment if unread
        }
    };

    // Toggle password visibility
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Fetch user data from storage/API
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await axios.get('https://bitebuddy-backend-6wwq.onrender.com/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    const userData = response.data;

                    // Store user data
                    setUser(userData);
                    setEditProfileData({
                        name: userData.name,
                        email: userData.email,
                        id: userData.id,
                    });

                    // Store in localStorage for persistence
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                // If unauthorized, redirect to login
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };

        setTimeout(() => {
            const storedUser = JSON.parse(localStorage.getItem("userData"));
            if (storedUser) {
                setUser(storedUser);
                setEditProfileData({
                    name: storedUser.name,
                    email: storedUser.email,
                    id: storedUser.id,
                });
            } else {
                fetchUserData();
            }
        }, 500); // Delay added to ensure localStorage updates

    }, [navigate]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            // Correct endpoint for password change
            const response = await axios.post('https://bitebuddy-backend-6wwq.onrender.com/api/changepassword',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setSuccess('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setShowPasswordForm(false);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Current password is incorrect');
            } else {
                setError('Failed to change password. Please try again.');
            }
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            // Correct endpoint for profile update
            const response = await axios.put('https://bitebuddy-backend-6wwq.onrender.com/api/profile',
                {
                    name: editProfileData.name,
                    email: editProfileData.email,
                    id: editProfileData.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // Update local user data
                setUser({
                    ...user,
                    name: editProfileData.name,
                    email: editProfileData.email,
                    id: editProfileData.id
                });

                // Update localStorage if being used
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData) {
                    userData.name = editProfileData.name;
                    userData.email = editProfileData.email;
                    userData.id = editProfileData.id;
                    localStorage.setItem('userData', JSON.stringify(userData));
                }

                setSuccess('Profile updated successfully');
                setShowEditForm(false);
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleEditToggle = () => {
        // Reset form data to current user values when toggling
        setEditProfileData({
            name: user.name,
            email: user.email,
            id: user.id
        });
        setShowEditForm(!showEditForm);
        // Close password form if open
        if (showPasswordForm) setShowPasswordForm(false);
        setError('');
        setSuccess('');
    };

    const handlePasswordToggle = () => {
        setShowPasswordForm(!showPasswordForm);
        // Close edit form if open
        if (showEditForm) setShowEditForm(false);
        setError('');
        setSuccess('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/');
    };

    return (
        <>
            <Header />
            <div style={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f3f6fb 100%)' }}>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                {/* Header Section with Gradient Background */}
                                <div className="text-white p-4 pb-5 text-center"
                                    style={{ background: "linear-gradient(45deg, #ff6b6b, #ff6262)" }}>
                                    <Link
                                        className="nav-link mx-2"
                                        to="/admin"
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "60px",
                                        }}
                                    >
                                        <button type="button" className="btn btn-lg position-relative">
                                            <i
                                                className="fa-solid fa-user-gear"
                                                style={{
                                                    color: "#ffffff",
                                                    transition: "transform 0.2s ease-in-out",
                                                    transform: isAdminHovered ? "scale(1.2)" : "scale(1)",
                                                }}
                                                onMouseEnter={() => setIsAdminHovered(true)}
                                                onMouseLeave={() => setIsAdminHovered(false)}
                                            />
                                        </button>
                                    </Link>
                                    <Link
                                        className="nav-link mx-2"
                                        to="/notifications"
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                        }}
                                    >
                                        <button type="button" className="btn btn-lg position-relative">
                                            <i
                                                className="fa-solid fa-bell"
                                                style={{
                                                    color: "#ffffff",
                                                    transition: "transform 0.2s ease-in-out",
                                                    transform: isNotificationHovered ? "scale(1.2)" : "scale(1)",
                                                }}
                                                onMouseEnter={() => setIsNotificationHovered(true)}
                                                onMouseLeave={() => setIsNotificationHovered(false)}
                                            />
                                            {unreadCount > 0 && (
                                                <span
                                                    className="position-absolute badge rounded-pill bg-danger"
                                                    style={{
                                                        top: '3px',
                                                        right: '5px',
                                                        fontSize: '0.6rem',
                                                        padding: '2px 6px',
                                                        lineHeight: '1',
                                                    }}
                                                >
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </Link>
                                    <div className="display-1 mb-3">
                                        <i className="fa-solid fa-user-circle"></i>
                                    </div>
                                    <h2 className="fw-bold mb-0">{user.name}</h2>
                                    <p className="text-white-50">{user.email}</p>
                                </div>

                                {/* Profile Information with Negative Margin for Card Effect */}
                                <div className="card mx-4 shadow-sm position-relative" style={{ marginTop: '-30px' }}>
                                    <div className="card-body p-4">
                                        {/* User Information */}
                                        <div className="row mb-4">
                                            <div className="col-sm-6 mb-3">
                                                <div className="p-3 border rounded-3 h-100 bg-light">
                                                    <h6 className="text-muted text-uppercase small mb-2">
                                                        <i className="fa-solid fa-user me-2"></i>Role
                                                    </h6>
                                                    <p className="mb-0 fw-bold text-capitalize">{user.selectUser}</p>
                                                </div>
                                            </div>

                                            <div className="col-sm-6 mb-3">
                                                <div className="p-3 border rounded-3 h-100 bg-light">
                                                    <h6 className="text-muted text-uppercase small mb-2">
                                                        <i className="fa-solid fa-address-card me-2"></i>
                                                        {user.selectUser === 'student' ? 'Student ID' : 'Faculty ID'}
                                                    </h6>
                                                    <p className="mb-0 fw-bold">{user.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="card-body pt-0 px-4 pb-4">
                                    {error && <p className="warnings-failed text-center mb-3">{error}</p>}
                                    {success && <p className="warnings-success text-center mb-3">{success}</p>}

                                    <div className="d-grid gap-2">
                                        <button
                                            onClick={handleEditToggle}
                                            className="btn btn-lg btn-primary rounded-pill text-white login-btn"
                                            style={{ background: "linear-gradient(90deg, #ff6b6b, #ff4444, #ff6262)", border: 'none' }}
                                        >
                                            <i className="fa-solid fa-edit me-2"></i>
                                            {showEditForm ? 'Cancel' : 'Edit Profile'}
                                        </button>

                                        <button
                                            onClick={handlePasswordToggle}
                                            className="btn btn-lg btn-primary rounded-pill text-white login-btn"
                                            style={{ background: "linear-gradient(90deg, #ff6b6b, #ff4444, #ff6262)", border: 'none' }}
                                        >
                                            <i className="fa-solid fa-lock me-2"></i>
                                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-lg btn-outline-secondary rounded-pill"
                                        >
                                            <i className="fa-solid fa-sign-out-alt me-2"></i>
                                            Logout
                                        </button>
                                    </div>

                                    {/* Edit Profile Form */}
                                    {showEditForm && (
                                        <div className="mt-4 p-4 border rounded-4 bg-light">
                                            <h4 className="fw-bold mb-4">
                                                <i className="fa-solid fa-user-edit me-2"></i>
                                                Edit Profile
                                            </h4>

                                            <form onSubmit={handleProfileUpdate}>
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="form-label">Name</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa-solid fa-user"></i>
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="name"
                                                            value={editProfileData.name}
                                                            onChange={(e) => setEditProfileData({
                                                                ...editProfileData,
                                                                name: e.target.value
                                                            })}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">Email</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa-solid fa-envelope"></i>
                                                        </span>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            value={editProfileData.email}
                                                            onChange={(e) => setEditProfileData({
                                                                ...editProfileData,
                                                                email: e.target.value
                                                            })}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="id" className="form-label">
                                                        {user.selectUser === 'student' ? 'Student ID' : 'Faculty ID'}
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text">
                                                            <i className="fa-solid fa-id-card"></i>
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="id"
                                                            value={editProfileData.id}
                                                            onChange={(e) => setEditProfileData({
                                                                ...editProfileData,
                                                                id: e.target.value
                                                            })}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-grid">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-lg rounded-pill login-btn"
                                                        style={{ background: "linear-gradient(90deg, #ff6b6b, #ff4444, #ff6262)", border: 'none' }}
                                                    >
                                                        <i className="fa-solid fa-save me-2"></i>
                                                        Update Profile
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Password Change Form */}
                                    {showPasswordForm && (
                                        <div className="mt-4 p-4 border rounded-4 bg-light">
                                            <h4 className="fw-bold mb-4">
                                                <i className="fa-solid fa-key me-2"></i>
                                                Change Password
                                            </h4>

                                            <form onSubmit={handlePasswordChange}>
                                                <div className="input-group mb-3">
                                                    <div className="password-container w-100">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Current Password"
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            required
                                                        />
                                                        <span className="toggle-password" onClick={togglePassword}>
                                                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="input-group mb-3">
                                                    <div className="password-container w-100">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="New Password"
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            required
                                                        />
                                                        <span className="toggle-password" onClick={togglePassword}>
                                                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="input-group mb-4">
                                                    <div className="password-container w-100">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Confirm New Password"
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            required
                                                        />
                                                        <span className="toggle-password" onClick={togglePassword}>
                                                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="d-grid">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-lg rounded-pill login-btn"
                                                        style={{ background: "linear-gradient(90deg, #ff6b6b, #ff4444, #ff6262)", border: 'none' }}
                                                    >
                                                        <i className="fa-solid fa-check-circle me-2"></i>
                                                        Update Password
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
