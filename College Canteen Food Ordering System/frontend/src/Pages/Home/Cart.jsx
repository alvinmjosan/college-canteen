import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './HomePage.css';
import { useCart } from '../../Context/CartContext';
import Header from './Header';
import { useOrders } from '../../Context/OrderContext';

const Cart = () => {
    return (
        <>
            <Header />
            <div className="hero-section">
                <main className="container">
                    <h1 className="menu-title"><span>🛒</span> Your Cart</h1>
                    <CartContainer />
                </main>
            </div>
        </>
    );
};

const CartContainer = () => {
    const { cartItems, setCartItems, clearCart } = useCart();
    const [orderState, setOrderState] = useState({
        deliveryMethod: '',
        paymentMethod: '',
        pickupTime: '',
        discountPercentage: 0
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return (
        <>
            <div className="cart-container">
                <CartItems
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    clearCart={clearCart}
                />
                <OrderSummary
                    cartItems={cartItems}
                    orderState={orderState}
                    setOrderState={setOrderState}
                    setShowSuccessModal={setShowSuccessModal}
                />
            </div>
            {showSuccessModal && (
                <SuccessModal
                    orderState={orderState}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </>
    );
};

const CartItems = ({ clearCart }) => {
    const { cartItems, changeQuantity, removeFromCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-items">
                <div className="cart-items-header">
                    <h2 className="cart-items-title">Cart Items (0)</h2>
                    <button className="cart-clear-btn" onClick={clearCart}>
                        <span>🗑️</span> Clear Cart
                    </button>
                </div>
                <div className="empty-cart">
                    <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" />
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link className="browse-menu-btn" to="/menu">Browse Menu</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-items">
            <div className="cart-items-header">
                <h2 className="cart-items-title">Cart Items ({cartItems.length})</h2>
                <button className="cart-clear-btn" onClick={clearCart}>
                    <span>🗑️</span> Clear Cart
                </button>
            </div>

            {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                    <div className="item-image">
                        <img src={item.img} alt={item.name} />
                    </div>
                    <div className="item-details">
                        <h3>
                            {item.name}
                            {item.isSpecial && <span className="special-badge">Lunch Special</span>}
                        </h3>
                        <p>{item.details}</p>
                    </div>
                    <div className="item-price">₹{item.price.toFixed(2)}</div>
                    <div className="quantity-control">
                        <button
                            className="quantity-btn decrease-btn"
                            onClick={() => changeQuantity(item._id, -1)}
                        >
                            -
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                            className="quantity-btn increase-btn"
                            onClick={() => changeQuantity(item._id, 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                    <button className="item-remove" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
            ))}
        </div>
    );
};

const OrderSummary = ({ cartItems, orderState, setOrderState, setShowSuccessModal }) => {
    const { userRole } = useCart();
    const { createOrder } = useOrders();
    const [upiId, setUpiId] = useState("");
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [warning, setWarning] = useState(0);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("https://bitebuddy-backend-6wwq.onrender.com/api/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserId(response.data._id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };
    
        fetchUserId();
    }, []);

    const calculateOrderTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = 0.06; // 6% tax
        const tax = subtotal * taxRate;
        const deliveryFee = orderState.deliveryMethod === 'delivery' ? 1.99 : 0;

        let discount = 0;
        if (orderState.discountPercentage > 0) {
            discount = subtotal * (orderState.discountPercentage / 100);
        }

        const total = subtotal + tax + deliveryFee - discount;

        return {
            subtotal,
            tax,
            deliveryFee,
            discount,
            total
        };
    };


    const setDeliveryMethod = (method) => {
        setOrderState({
            ...orderState,
            deliveryMethod: method
        });
        setWarning(0)
    };

    const setPaymentMethod = (method) => {
        setOrderState({
            ...orderState,
            paymentMethod: method
        });
        setWarning(0)
    };

    const handleCheckout = () => {
        if (!orderState.deliveryMethod && userRole === 'faculty') {
            setWarning(1); // Show warning
            return;
        }
        if (!orderState.paymentMethod) {
            setWarning(2); // Show warning
            return;
        }
        //Check UPI ID is valid
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        const isUpiIdValid = upiRegex.test(upiId);

        if (!address && orderState.deliveryMethod === 'delivery') {
            alert("Enter the Address");
        } else if (!isUpiIdValid) {
            alert("Invalid UPI ID");
        } else {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setShowSuccessModal(true);
            }, 5000); 
        }

        createOrder(userId, Date.now(), cartItems, totals.subtotal.toFixed(2), orderState.paymentMethod, orderState.deliveryMethod, address);
    };

    const totals = calculateOrderTotals();

    return (
        <>
            {cartItems.length > 0 ? (
                <div className="order-summary">
                    <h2 className="summary-title">Order Summary</h2>

                    <div className="delivery-options">
                        <div className="option-label">User:</div>
                        <div className="delivery-choice">
                            <div
                                className={`delivery-option ${userRole === 'student' || userRole === 'faculty' ? 'selected' : ''}`}
                            >
                                <div className="option-header2">
                                    <div className="option-price"><i class="fa-solid fa-user-tie fa-2xl"></i></div>
                                    <div className="option-name">{userRole === 'student' ? 'Student' : 'Faculty'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {userRole === 'faculty' &&
                        <div className="delivery-options">
                            <div className="option-label">Delivery Method:</div>
                            <div className="delivery-choice">
                                <div
                                    className={`delivery-option ${orderState.deliveryMethod === 'pickup' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryMethod('pickup')}
                                >
                                    <div className="option-header">
                                        <div className="option-name">Self Pickup</div>
                                        <div className="option-price">Free</div>
                                    </div>
                                    <div className="option-desc">Ready in 15-20 mins</div>
                                </div>
                                <div
                                    className={`delivery-option ${orderState.deliveryMethod === 'delivery' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryMethod('delivery')}
                                >
                                    <div className="option-header">
                                        <div className="option-name">Dorm Delivery</div>
                                        <div className="option-price">+₹1.99</div>
                                    </div>
                                    <div className="option-desc">30-45 mins</div>
                                </div>
                            </div>
                        </div>
                    }

                    {userRole === 'faculty' && orderState.deliveryMethod === 'delivery' && (
                        <div className="payment-text visible">
                        <div className="option-label">Enter Address (Room No, Department):</div>
                        <input
                            className="payment-select"
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='101, CSE'
                            required
                        />
                    </div>
                    )}

                    {warning === 1 && <p className="warning-message">⚠️ Please select a delivery method before proceeding.</p>}

                    <div className="payment-methods">
                        <div className="option-label">Payment Method:</div>
                        <div className="payment-options">
                            <div
                                className={`payment-option ${orderState.paymentMethod === 'upi' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <div className="payment-icon">📱</div>
                                <div className="payment-name">UPI</div>
                            </div>
                        </div>
                    </div>

                    {warning === 2 && <p className="warning-message">⚠️ Please select a payment method before proceeding.</p>}

                    {orderState.paymentMethod === 'upi' && (
                        <div className="payment-text visible">
                            <div className="option-label">Enter your UPI ID:</div>
                            <input
                                className="payment-select"
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder='UPI ID'
                                required
                            />
                        </div>
                    )}

                    {/* Price Summary */}
                    <div className="price-summary">
                        <div className="price-row">
                            <div className="price-label">Subtotal</div>
                            <div className="price-value">₹{totals.subtotal.toFixed(2)}</div>
                        </div>
                        <div className="price-row">
                            <div className="price-label">Tax</div>
                            <div className="price-value">₹{totals.tax.toFixed(2)}</div>
                        </div>
                        {totals.deliveryFee > 0 && (
                            <div className="price-row">
                                <div className="price-label">Delivery Fee</div>
                                <div className="price-value">₹{totals.deliveryFee.toFixed(2)}</div>
                            </div>
                        )}
                        {totals.discount > 0 && (
                            <div className="price-row discount-row">
                                <div className="price-label">Discount</div>
                                <div className="price-value">-₹{totals.discount.toFixed(2)}</div>
                            </div>
                        )}
                        <div className="price-row total-row">
                            <div className="price-label">Total</div>
                            <div className="price-value">₹{totals.total.toFixed(2)}</div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="loading-content">
                                <div className="spinner-border text-light" style={{ width: "3rem", height: "3rem" }}></div>
                                <p>Processing your order...</p>
                            </div>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? (
                            <div className="d-flex align-items-center">
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                            </div>
                        ) : (
                            `Place Order • ₹${totals.total.toFixed(2)}`
                        )}
                    </button>
                    <p className="checkout-note">🔒 Secure payment* </p>
                </div>
            ) : (
                // Disable Section
                // Disable Section
                // Disable Section
                // !!!!!
                <div className="order-summary-wrapped">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="delivery-options">
                        <div className="option-label">User:</div>
                        <div className="delivery-choice">
                            <div
                                className={`delivery-option ${userRole === 'student' || 'faculty' ? 'selected' : ''}`}
                            >
                                <div className="option-header2">
                                    <div className="option-price"><i class="fa-solid fa-user-tie fa-2xl"></i></div>
                                    <div className="option-name">{userRole === 'student' ? 'Student' : 'Faculty'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {userRole === 'faculty' &&
                        <div className="delivery-options">
                            <div className="option-label">Delivery Method:</div>
                            <div className="delivery-choice">
                                <div
                                    className={`delivery-option ${orderState.deliveryMethod === 'pickup' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryMethod('pickup')}
                                >
                                    <div className="option-header">
                                        <div className="option-name">Self Pickup</div>
                                        <div className="option-price">Free</div>
                                    </div>
                                    <div className="option-desc">Ready in 15-20 mins</div>
                                </div>
                                <div
                                    className={`delivery-option ${orderState.deliveryMethod === 'delivery' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryMethod('delivery')}
                                >
                                    <div className="option-header">
                                        <div className="option-name">Dorm Delivery</div>
                                        <div className="option-price">+₹1.99</div>
                                    </div>
                                    <div className="option-desc">30-45 mins</div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="payment-methods">
                        <div className="option-label">Payment Method:</div>
                        <div className="payment-options">
                            <div
                                className={`payment-option ${orderState.paymentMethod === 'upi' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                <div className="payment-icon">📱</div>
                                <div className="payment-name">UPI</div>
                            </div>
                        </div>
                    </div>

                    {orderState.paymentMethod === 'upi' && (
                        <div className="payment-text visible">
                            <div className="option-label">Enter your UPI ID:</div>
                            <input
                                className="payment-select"
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder='UPI ID'
                            />
                        </div>
                    )}

                    {/* Price Summary */}
                    <div className="price-summary">
                        <div className="price-row">
                            <div className="price-label">Subtotal</div>
                            <div className="price-value">₹{totals.subtotal.toFixed(2)}</div>
                        </div>
                        <div className="price-row">
                            <div className="price-label">Tax</div>
                            <div className="price-value">₹{totals.tax.toFixed(2)}</div>
                        </div>
                        {totals.deliveryFee > 0 && (
                            <div className="price-row">
                                <div className="price-label">Delivery Fee</div>
                                <div className="price-value">₹{totals.deliveryFee.toFixed(2)}</div>
                            </div>
                        )}
                        {totals.discount > 0 && (
                            <div className="price-row discount-row">
                                <div className="price-label">Discount</div>
                                <div className="price-value">-₹{totals.discount.toFixed(2)}</div>
                            </div>
                        )}
                        <div className="price-row total-row">
                            <div className="price-label">Total</div>
                            <div className="price-value">₹{totals.total.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Place Order • ₹{totals.total.toFixed(2)}
                    </button>
                    <p className="checkout-note">🔒 Secure payment* </p>
                </div>
            )};
        </>
    );
};

const SuccessModal = ({ onClose }) => {
    const { clear } = useCart();
    return (
        <div className="modal-overlay visible">
            <div className="success-modal">
                <div className="success-icon">✓</div>
                <h2>Order Confirmed Successfully!</h2>
                <p>Your order is placed as per admin approved the order request. Wait 30 min - 1 hr for confirmation.</p>
                <div className="pickup-details">
                    
                    <p>Please bring your Order Id</p>
                </div>
                <button className="close-modal-btn" onClick={() => {
                    clear(); 
                    onClose();
                }}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
};

export default Cart;
