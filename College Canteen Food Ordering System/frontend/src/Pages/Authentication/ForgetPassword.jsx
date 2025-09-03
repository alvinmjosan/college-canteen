import React, { useState } from 'react'
import "./logSignUp.css"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgetPassword = () => {

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://bitebuddy-backend-6wwq.onrender.com/api/forgetpassword", { email });
      setMessage("Password reset successfully! Please check your gmail for getting the temp password");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 3500);
    }
    catch (err) {
      setMessage("Error sending temporary password! Please check your email");
    }
  };

  return (
    <>
      <body>
        <div className='main'>
          <div className="login-container">
            <div className="login-logo">
              <a className="navbar-brand" href="/">
                <span>𝘽𝙞𝙩𝙚</span><span>𝘽𝙪𝙙𝙙𝙮</span>
              </a></div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <button type="submit" className="login-btn">Submit</button>
            </form>
            {message && <p className={message.includes("successfully") ? 'warnings-success' : 'warnings-failed'}>{message}</p>}
            <div className="signup-link">
              <Link to="/">Go Back</Link>
            </div>
          </div>
        </div>
      </body>
    </>
  )
}

export default ForgetPassword
