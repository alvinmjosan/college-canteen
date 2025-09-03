import React, { useState } from "react";
import axios from "axios";
import "./logSignUp.css";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [warn, setWarn] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!password || password.length < 6) {
            setWarn("Password must be at least 6 characters long!");
        }
        else {
            setWarn("");
            setShowConfirmDialog(true); // Open password confirmation dialog
        }
    };

    const handleConfirmPassword = async () => {
        if (confirmPassword !== password) {
            setWarn("Passwords do not match. Please try again!");
            return;
        }

        try {
            const res = await axios.post("https://bitebuddy-backend-6wwq.onrender.com/api/signup", {
                name,
                email,
                selectedOption,
                id,
                password,
            });

            const { token, selectOption } = res.data;
            localStorage.setItem("token", token); // Store JWT token
            localStorage.setItem("userRole", res.data.selectOption);

            if (res.status === 200) {
                setMessage("Account created successfully!");
                setTimeout(() => {
                    setMessage("");
                    navigate("/");
                }, 3000);
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setMessage("User already exists! Please try another email or user id.");
            } else {
                setMessage("Sign-up failed. Please try again.");
            }
        }

        setShowConfirmDialog(false);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
        setConfirmPassword("");
        setWarn("");
    };

    return (
        <div className='main'>
            <div className='bg'></div>
            <div className="login-container">
                <div className="login-logo">
                    <a className="navbar-brand" href="/">
                        <span>𝘽𝙞𝙩𝙚</span><span>𝘽𝙪𝙙𝙙𝙮</span>
                    </a>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <i className="fa-solid fa-bars"></i>
                        <select
                            name="dropdown"
                            id="user"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>

                    {selectedOption && (
                        <>
                            <div className="input-group">
                                <i className="fa-solid fa-address-card"></i>
                                <input
                                    type="text"
                                    placeholder={selectedOption === "student" ? "Student ID (Admission No)" : "Faculty ID"}
                                    required
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <div className="password-container">
                                    <i className="fas fa-lock"></i>
                                    <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="New Password" required />
                                    <span className="toggle-password" onClick={togglePassword}>
                                        {showPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="login-btn">Create Account</button>
                </form>
                {message && <p className={message.includes("successfully") ? 'warnings-success' : 'warnings-failed'}>{message}</p>}
                {warn.includes("characters") && (
                    <p className={warn.includes("successfully") ? "warnings-success" : "warnings-failed"}>
                        {warn}
                    </p>
                )}

                <div className="signup-link">
                    Already have an account? <Link to="/">Log In</Link>
                </div>
            </div>

            {showConfirmDialog && (
                <>
                    <div className="modal show d-flex tabIndex=-1 p-5">
                        <div className="modal-dialog modal-dialog-centered ">
                            <div className="modal-content p-3">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Your Password</h5>
                                    <button type="button" className="btn-close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-center mb-3 text-align-center">Please re-enter your password to confirm.</p>
                                    <div className="input-group justify-content-center align-items-center">
                                        <div className="password-container">
                                            <i className="fas fa-lock"></i>
                                            <input

                                                type={showPassword ? "text" : "password"}
                                                placeholder="Re-enter password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <span className="toggle-password" onClick={togglePassword}>
                                                {showPassword ? (
                                                    <i className="fa-solid fa-eye"></i>
                                                ) : (
                                                    <i className="fa-solid fa-eye-slash"></i>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {warn && (
                                        <p className={warn.includes("successfully") ? "warnings-success" : "warnings-failed"}>
                                            {warn}
                                        </p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleConfirmPassword}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show"></div>
                </>
            )}
        </div>
    );
};

export default SignUp;
