import { useState, useEffect } from "react";
import {
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "../firebase.js";

import "../css/ForgotPassword.css";


function ForgotPassword(props) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(true);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent!");
            setVisible(false);
            setSuccess(true);
        } catch (error) {
            setMessage("Error sending password reset email.");
        }
    };

    return (
        <div id="forgot-password-container" hidden={!props.visible}>
            <div id="forgot-password-popup">
                <button
                id="forgot-password-close-btn"
                onClick={() => {
                    setEmail("");
                    setMessage("");
                    setVisible(true);
                    props.changeVisible(false);
                }}
                title="Close"
                >
                ✕
                </button>
                <div id="forgot-password-content">
                    {message && 
                    <p id="forgot-password-message" 
                    style={{color: success ? "green" : "red", fontSize: success ? "20px" : "12px"
                    }}>
                        {message}</p>}
                    <div id="forgot-password-inner" hidden={!visible}>
                        <h1 id="forgot-password-title">Reset Your Password</h1>
                        <p id="forgot-password-instructions">
                            Enter your email address below and 
                            we'll send you instructions to reset your password.</p>
                        <input 
                            type="email"
                            id="forgot-password-email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <br />
                        <br />
                        <button id="forgot-password-button" onClick={handleResetPassword}>
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ForgotPassword;