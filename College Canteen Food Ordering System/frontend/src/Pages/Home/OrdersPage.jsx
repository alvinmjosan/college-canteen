import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../Context/OrderContext";
import Header from "./Header";
import "./HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const OrdersPage = () => {
    const { orders } = useOrders();
    const [activeTab, setActiveTab] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }, [orders]);

    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;
        if (activeTab === "ongoing") return order.isStatus === "processing";
        if (activeTab === "completed") return order.isStatus === "completed";
        if (activeTab === "cancelled") return order.isStatus === "cancelled";
        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString || typeof dateString !== "string") {
            return "Date not available";
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(date);
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const closeOrderDetails = () => {
        setShowDetailModal(false);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "processing":
                return "bg-warning bg-opacity-25 text-warning";
            case "completed":
                return "bg-success bg-opacity-25 text-success";
            case "cancelled":
                return "bg-danger bg-opacity-25 text-danger";
            default:
                return "";
        }
    };

    const getStatusDotClass = (status) => {
        switch (status) {
            case "processing":
                return "bg-warning";
            case "completed":
                return "bg-success";
            case "cancelled":
                return "bg-danger";
            default:
                return "";
        }
    };

    const customStyles = {
        spinner: { animation: "spin 1s linear infinite" },
        orderCard: { transition: "all 0.2s ease" },
        orderCardHover: { transform: "translateY(-3px)", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)" },
        modalFadeIn: { animation: "modalFadeIn 0.3s ease" },
        statusDot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block", marginRight: "6px" },
        progressFill: { width: "66%", height: "100%", backgroundColor: "#f59f00", borderRadius: "4px" },
        cancelledStatus: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block", marginRight: "6px", backgroundColor: "#dc3545" },
    };

    const keyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <Header />
            <div className="hero-section">
                <div className="container">
                    <h1 className="menu-title">
                        <span>📋</span>Your Orders
                    </h1>

                    <div className="bg-white rounded-3 shadow-sm mb-4 p-2">
                        <div className="d-flex flex-wrap">
                            <button
                                className={`btn flex-grow-1 fw-bold rounded-3 mx-1 mb-2 mb-md-0`}
                                style={{ backgroundColor: activeTab === "all" ? "#ff6b6b" : "white", color: activeTab === "all" ? "white" : "black" }}
                                onClick={() => setActiveTab("all")}
                            >
                                All Orders
                            </button>
                            <button
                                className={`btn flex-grow-1 fw-bold rounded-3 mx-1 mb-2 mb-md-0`}
                                style={{ backgroundColor: activeTab === "ongoing" ? "#ff6b6b" : "white", color: activeTab === "ongoing" ? "white" : "black" }}
                                onClick={() => setActiveTab("ongoing")}
                            >
                                Ongoing
                            </button>
                            <button
                                className={`btn flex-grow-1 fw-bold rounded-3 mx-1 mb-2 mb-md-0`}
                                style={{ backgroundColor: activeTab === "completed" ? "#ff6b6b" : "white", color: activeTab === "completed" ? "white" : "black" }}
                                onClick={() => setActiveTab("completed")}
                            >
                                Completed
                            </button>
                            <button
                                className={`btn flex-grow-1 fw-bold rounded-3 mx-1`}
                                style={{ backgroundColor: activeTab === "cancelled" ? "#ff6b6b" : "white", color: activeTab === "cancelled" ? "white" : "black" }}
                                onClick={() => setActiveTab("cancelled")}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <div
                                className="border border-4 border-danger border-end-0 rounded-circle mb-3"
                                style={{ ...customStyles.spinner, width: "40px", height: "40px" }}
                            ></div>
                            <p className="text-secondary">Loading your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-4 shadow-sm text-center p-5">
                            <img src="/api/placeholder/250/250" alt="No orders" className="mb-4 opacity-75" width="150" height="150" />
                            <h3 className="fs-4 mb-2">No orders found</h3>
                            <p className="text-secondary mb-4">You haven't placed any orders in this category yet.</p>
                            <Link
                                to="/menu"
                                className="btn btn-danger fw-bold rounded-3 px-4 py-2 transition-all"
                                style={{ backgroundColor: "#ff6b6b", color: "white" }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff5252")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
                            >
                                Order Now
                            </Link>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {filteredOrders.map((order) => (
                                <div
                                    className="bg-white rounded-3 shadow-sm p-4"
                                    key={order._id}
                                    onClick={() => openOrderDetails(order)}
                                    style={customStyles.orderCard}
                                    onMouseOver={(e) => Object.assign(e.currentTarget.style, customStyles.orderCardHover)}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex flex-column">
                                            <small className="text-secondary">Order #</small>
                                            <span className="fw-bold">{order.orderNumber}</span>
                                        </div>
                                        <div className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(order.isStatus)}`}>
                                            <span
                                                className="d-inline-block"
                                                style={{
                                                    ...customStyles.statusDot,
                                                    backgroundColor: order.isStatus === "processing" ? "#f59f00" 
                                                        : order.isStatus === "completed" ? "#28a745" 
                                                        : order.isStatus === "cancelled" ? "#dc3545" 
                                                        : "#6c757d",
                                                }}
                                            ></span>
                                            <span>{order.isStatus}</span>
                                        </div>
                                    </div>
                                    <div className="py-3 border-top border-bottom mb-3">
                                        <div className="d-flex align-items-center text-secondary mb-2">
                                            <i className="fa-regular fa-calendar me-2"></i>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div>
                                            {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                                                <>
                                                    {order.orderItems.slice(0, 2).map((item, index) => (
                                                        <span key={index}>
                                                            {item.quantity}x {item.name}
                                                            {index < Math.min(1, order.orderItems.length - 1) ? ", " : ""}
                                                        </span>
                                                    ))}
                                                    {order.orderItems.length > 2 && (
                                                        <span className="text-danger ms-1">+{order.orderItems.length - 2} more</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span>No items</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column">
                                            <small className="text-secondary">Total</small>
                                            <span className="fw-bold fs-5">₹{order.deliveryMethod === "delivery"
                                                    ? (order.total + order.total * 0.06 + 1.99).toFixed(2)
                                                    : (order.total + order.total * 0.06).toFixed(2)}</span>
                                        </div>
                                        <button className="btn btn-light fw-bold rounded-3 px-3 py-2 d-flex align-items-center">
                                            View Details <i className="fa-solid fa-angle-right ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showDetailModal && selectedOrder && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center p-3"
                            style={{ zIndex: 1050 }}
                            onClick={closeOrderDetails}
                        >
                            <div
                                className="bg-white rounded-4 w-100 position-relative overflow-auto p-4"
                                style={{ ...customStyles.modalFadeIn, maxWidth: "600px", maxHeight: "90vh" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                                    onClick={closeOrderDetails}
                                    style={{ width: "32px", height: "32px" }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fs-4 fw-bold">Order Details</h2>
                                    <div className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(selectedOrder.isStatus)}`}>
                                        <span
                                            className="d-inline-block"
                                            style={{
                                                ...customStyles.statusDot,
                                                backgroundColor: selectedOrder.isStatus === "processing" ? "#f59f00" 
                                                    : selectedOrder.isStatus === "completed" ? "#28a745"
                                                    : selectedOrder.isStatus === "cancelled" ? "#dc3545"
                                                    : "#6c757d",
                                            }}
                                        ></span>
                                        <span>{selectedOrder.isStatus}</span>
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6 mb-2 mb-md-0">
                                        <small className="text-secondary d-block mb-1">Order Number</small>
                                        <span className="fw-bold">{selectedOrder.orderNumber}</span>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-secondary d-block mb-1">Date & Time</small>
                                        <span className="fw-bold">{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                </div>

                                {selectedOrder.isStatus === "processing" && (
                                    <div className="bg-warning bg-opacity-10 rounded-3 p-4 mb-4">
                                        <div className="d-flex align-items-center mb-3 text-warning fw-bold">
                                            <i className="fa-regular fa-clock me-2"></i>
                                            <span>Estimated Ready: In Progress</span>
                                        </div>
                                        <div className="bg-light rounded-pill overflow-hidden mb-3" style={{ height: "8px" }}>
                                            <div style={customStyles.progressFill}></div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="text-center" style={{ width: "33.333%" }}>
                                                <div
                                                    className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center mx-auto mb-2"
                                                    style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}
                                                >
                                                    ✓
                                                </div>
                                                <small className="text-secondary">Order Placed</small>
                                            </div>
                                            <div className="text-center" style={{ width: "33.333%" }}>
                                                <div
                                                    className="rounded-circle bg-light text-secondary d-flex justify-content-center align-items-center mx-auto mb-2"
                                                    style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}
                                                >
                                                    🍔
                                                </div>
                                                <small className="text-secondary">Order Not Confirmed</small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOrder.isStatus === "cancelled" && (
                                    <div className="bg-danger bg-opacity-10 rounded-3 p-4 mb-4">
                                        <div className="d-flex align-items-center mb-3 text-danger fw-bold">
                                            <i className="fa-solid fa-ban me-2"></i>
                                            <span>Order Cancelled</span>
                                        </div>
                                        <p className="text-secondary mb-0">This order has been cancelled. If you have any questions, please contact customer support.</p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="fs-5 fw-bold mb-3">Order Items</h3>
                                    <div className="mb-3">
                                        {Array.isArray(selectedOrder.orderItems) && selectedOrder.orderItems.length > 0 ? (
                                            selectedOrder.orderItems.map((item, index) => (
                                                <div
                                                    className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                                    key={index}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-danger fw-bold me-2">{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <span>No items available</span>
                                        )}
                                    </div>

                                    <div className="bg-light rounded-3 p-4">
                                        <div className="d-flex justify-content-between mb-2 text-secondary">
                                            <span>Subtotal</span>
                                            <span>₹{selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 text-secondary">
                                            <span>Tax (6%)</span>
                                            <span>₹{(selectedOrder.total * 0.06).toFixed(2)}</span>
                                        </div>
                                        {selectedOrder.deliveryMethod === "delivery" && (
                                            <div className="d-flex justify-content-between mb-2 text-secondary">
                                                <span>Delivery Fee</span>
                                                <span>₹1.99</span>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between pt-2 border-top border-dashed mt-2 fw-bold">
                                            <span>Total</span>
                                            <span>
                                                ₹
                                                {selectedOrder.deliveryMethod === "delivery"
                                                    ? (selectedOrder.total + selectedOrder.total * 0.06 + 1.99).toFixed(2)
                                                    : (selectedOrder.total + selectedOrder.total * 0.06).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mt-4">
                                    <div className="mb-3 mb-md-0">
                                        <div className="mb-3">
                                            <small className="text-secondary d-block mb-1">Payment Method</small>
                                            <span>
                                                {selectedOrder.paymentMethod === "card" && (
                                                    <>
                                                        <i className="fa-solid fa-credit-card me-2"></i> Card
                                                    </>
                                                )}
                                                {selectedOrder.paymentMethod === "upi" && (
                                                    <>
                                                        <i className="fa-solid fa-mobile-screen me-2"></i> UPI
                                                    </>
                                                )}
                                                {selectedOrder.paymentMethod === "cash" && (
                                                    <>
                                                        <i className="fa-solid fa-money-bill me-2"></i> Cash
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            <small className="text-secondary d-block mb-1">
                                                {selectedOrder.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
                                            </small>
                                            <span>
                                                {selectedOrder.deliveryMethod === "pickup" ? (
                                                    <>
                                                        <i className="fa-solid fa-store me-2"></i> College Canteen
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-motorcycle me-2"></i> {selectedOrder.deliveryAddress}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedOrder.isStatus === "processing" ? (
                                        <Link
                                            className="btn btn-light rounded-3 fw-bold py-2 px-4 w-100 w-md-auto"
                                            to="/aboutus"
                                        >
                                            Need Help?
                                        </Link>
                                    ) : selectedOrder.isStatus === "cancelled" ? (
                                        <Link
                                            className="btn rounded-3 fw-bold py-2 px-4 w-100 w-md-auto"
                                            style={{ backgroundColor: "#ff6b6b", color: "white" }}
                                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff5252")}
                                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
                                            to="/menu"
                                        >
                                            Order Again
                                        </Link>
                                    ) : (
                                        <Link
                                            className="btn rounded-3 fw-bold py-2 px-4 w-100 w-md-auto"
                                            style={{ backgroundColor: "#ff6b6b", color: "white" }}
                                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff5252")}
                                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
                                            to="/menu"
                                        >
                                            Order Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrdersPage;