import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./HomePage.css";
import { useCart } from '../../Context/CartContext';
import SearchBar from './Search/SearchBar';

const Header = () => {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <div className="top-bar bg-light py-2">
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

            <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
                <div className="container">
                    <Link className="navbar-brand" to="/home">
                        <span>𝘽𝙞𝙩𝙚</span><span>𝘽𝙪𝙙𝙙𝙮</span>
                    </Link>
                    <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item"><Link className="nav-link" to="/menu">Menu</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/aboutus">About Us</Link></li>
                        </ul>
                        <div className="navbar-nav">
                            <SearchBar />
                            <Link className="nav-link mx-2" to="/cart">
                                <button type="button" className="btn btn-lg">
                                    🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </button>
                            </Link>
                            <Link className="nav-link mx-2" to="/profile">
                                <button type="button" className="btn btn-lg">👤</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;