import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./HomePage.css"
import React, { useEffect, useState } from 'react';
import { useCart } from "../../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { toast } from "react-toastify";

const HomePage = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [review, setReview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await axios.get("https://bitebuddy-backend-6wwq.onrender.com/api/menu");
        const limitedItems = response.data;
        setPopularItems(limitedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load popular products.");
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0; // Return 0 if no ratings

    const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
    const average = total / ratings.length;
    return Number(average.toFixed(1)); // Round to 1 decimal place
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      toast.error('Please enter a review before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.info('Please log in to submit a review');
        navigate('/');
        return;
      }

      const response = await axios.post(
        'https://bitebuddy-backend-6wwq.onrender.com/api/ratings',
        { review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Review submitted successfully!');
      setReview(''); // Clear input after submission
    } catch (error) {
      console.error('Error submitting review:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <>
      <Header />
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 hero-content">
              <h1>Fuel Your Studies With Fast And Easy Bites</h1>
              <p className="my-4">Fast, fresh and affordable - Order your campus cravings now !</p>
              <Link className="btn btn-success btn-lg" to="/menu">Order Now</Link>
            </div>
            <div className="col-md-6">
              <img src="https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.webp?a=1&b=1&s=612x612&w=0&k=20&c=a8j_p9BkWtsSX7WkcqeetigH8PYWXGayIGto9GiehNY=" alt="Fresh Vegetables" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <h3>🚚 Delivery - only ₹1.99</h3>
                <p>Exclusive food delivery for faculties</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <h3>🌿Fresh, & Flavorful</h3>
                <p>100% Delicious food - Every Bite Feels Right</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <h3>💯 Affordable prices</h3>
                <p>Enjoy budjet-friendly meals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our Popular Products</h2>
          {loading ? (
            <p className="text-center">Loading popular products...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            <div className="row">
              {popularItems.filter((item) => calculateAverageRating(item.ratings) >= 4).slice(0, 4).map((item) => (
                <div className="col-md-3 mb-4" key={item._id}>
                  <div className="card product-card">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5>{item.name}</h5>
                      <p>₹{item.price}</p>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4>"BiteBuddy –  Delicious Bites, College Eats!"</h4>
              <p>Exclusive food delivery for faculty members!</p>
            </div>
            <div className="col-md-4">
              <h4>Contact Us</h4>
              <ul className="list-unstyled">
                <li className="text-white">GCE Kannur,</li>
                <li className="text-white">Mangattuparamba,</li>
                <li className="text-white">Parassinikadavu P.O,</li>
                <li className="text-white">Kannur, Kerala - 670563</li>
                <li className="text-white"><i class="fa-solid fa-phone"></i> 0497-2320547</li>
                <li className="text-white"><i class="fa-solid fa-envelope"></i> gcek@canteen.com</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h4>Rate/Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <textarea
                  className="form-control mb-2"
                  placeholder="Enter your review..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="3"
                />
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
