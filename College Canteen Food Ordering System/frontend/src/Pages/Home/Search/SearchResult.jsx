import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../HomePage.css";
import Header from "../Header";
import { useCart } from "../../../Context/CartContext";
import axios from "axios"; // Added missing import

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [filteredItems, setFilteredItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("https://bitebuddy-backend-6wwq.onrender.com/api/menu");
                const itemsWithDelay = response.data.map((item, index) => ({
                    ...item,
                    delay: index * 100 // For animation, if needed
                }));
                setMenuItems(itemsWithDelay);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching menu items:", error);
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []); // Fetch once on mount

    useEffect(() => {
        if (!menuItems.length) return; // Wait until menuItems is populated

        setLoading(true); // Show loading during filtering
        const searchResults = menuItems.filter((item) => {
            const searchTerm = query.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
            );
        });

        // Simulate delay for UX (optional)
        const timeoutId = setTimeout(() => {
            setFilteredItems(searchResults);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId); // Cleanup on unmount or query change
    }, [query, menuItems]);

    return (
        <>
            <Header />
            <div className="search-results-page">
                <h2 className="page-title">
                    <span>🔍</span> Search Results: "{query}"
                </h2>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Searching for your food...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <>
                        <p className="results-count">{filteredItems.length} items found</p>
                        <div className="menu-container">
                            {filteredItems.map((item) => (
                                <div key={item._id} className="menu-item"> {/* Changed item.id to item._id */}
                                    <img className="menu-image" src={item.img} alt={item.name} />
                                    <div className="menu-info">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                    </div>
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
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-results">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1178/1178479.png"
                            alt="No results"
                            className="no-results-icon"
                        />
                        <h3>No items found</h3>
                        <p>We couldn't find any items matching "{query}"</p>
                        <p>Try checking your spelling or using different keywords</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResult;
