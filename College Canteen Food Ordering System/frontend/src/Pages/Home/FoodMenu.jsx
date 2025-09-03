import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./HomePage.css";
import Header from "./Header";
import { useCart } from "../../Context/CartContext";
import axios from 'axios';

const FoodMenu = () => {
    const [filteredItems, setFilteredItems] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [noItems, setNoItems] = useState(false);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("https://bitebuddy-backend-6wwq.onrender.com/api/menu");
                const itemsWithDelay = response.data.map((item, index) => ({
                    ...item,
                    delay: index * 100
                }));
                setFilteredItems(itemsWithDelay);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching menu items:", error);
                setLoading(false);
                setNoItems(true);
            }
        };

        fetchMenuItems();
    }, []);

    const handleFilter = (filter) => {
        setActiveFilter(filter);
        let visibleItems = 0;
        const newFilteredItems = filteredItems.map((item, index) => {
            const isVisible = filter === "all" || item.category === filter;
            if (isVisible) visibleItems++;
            return { ...item, hidden: !isVisible, delay: index * 100 };
        });

        setFilteredItems(newFilteredItems);
        setTimeout(() => setNoItems(visibleItems === 0), 100);
    };

    return (
        <>
            <Header />
            <div className="hero-section">
                <div className="container1">
                    <h1 className="menu-title">🍽️ Our Menu</h1>
                    <div className="filter-buttons">
                        {["all", "lunch", "tea & Snacks", "refreshments"].map((filter) => (
                            <button
                                key={filter}
                                className={`filter-button ${activeFilter === filter ? "active" : ""}`}
                                onClick={() => handleFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="menu-container">
                        {loading ? (
                            <p>Loading menu items...</p>
                        ) : noItems ? (
                            <p>No items available</p>
                        ) : (
                            filteredItems.map((item) =>
                                !item.hidden ? (
                                    <div key={item._id} className="menu-item" data-category={item.category}>
                                        <img src={item.img} alt={item.name} className="menu-image" />
                                        <div className="menu-info">
                                            <h3>{item.name}</h3>
                                            <p>{item.description}</p>
                                            <div className="menu-footer">
                                                <div className="price">₹{item.price}</div>
                                                <div className="add-cart" onClick={() => addToCart(item)}>
                                                    <svg
                                                        className="cart-icon"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FoodMenu;
