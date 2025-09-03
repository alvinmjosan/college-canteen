import React, { useState } from 'react'
import "./logSignUp.css"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCart } from '../../Context/CartContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserRole } = useCart();
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://bitebuddy-backend-6wwq.onrender.com/api/login", { email, password })
      if (res.status === 200) {
        // Store the authentication token in localStorage
        localStorage.setItem('token', res.data.token);
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(res.data.user));
        localStorage.setItem("userRole", res.data.user.selectUser);

        setMessage("Login Successfully");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      setMessage("Login failed! please try again");
    }
  }

  return (
    <>
      <div className='main'>
        <div className="login-container">
          <div className="login-logo">
            <a className="navbar-brand" href="/">
              <span>𝘽𝙞𝙩𝙚</span><span>𝘽𝙪𝙙𝙙𝙮</span>
            </a>
            {/* BiteBuddy */}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" required />
            </div>
            <div className="input-group">
              <div className="password-container">
                <i className="fas fa-lock"></i>
                <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Password" required />
                <span className="toggle-password" onClick={togglePassword}>
                  {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className={message.includes("Successfully") ? 'warnings-success' : 'warnings-failed'}>{message}</p>
          <div className="signup-link">
            <Link to='/forgetpassword'>forgot password?</Link>
          </div>
          <div className="signup-link">
            New here? <Link to="/signup">Create Account</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
