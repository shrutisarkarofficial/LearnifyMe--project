import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../style/SignUpAndLogInAndForget.css";

const Forget = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      setError("Please enter a valid email address.");
      setMessage(""); // Clear message if there's an error
      return;
    }
    
    setError("");
    setLoading(true);
    setMessage("Sending OTP...");

    try {
      const response = await axios.post("http://localhost:8080/users/send-otp", {
        email: email
      });
      
      toast.success("OTP sent successfully! Please check your email.");
      setMessage("OTP sent successfully! Please check your email.");
      
      // Redirect to OTP page with email and token
      navigate("/Get_Otp", {
        state: {
          email: email,
          token: response.data.token // Assuming the API returns a token
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-password-container">
      <h2>Forgot Password?</h2>
      <p>Enter your email address below and you'll receive an OTP to create a new password</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Get OTP"}
        </button>
      </form>
      {message && <p className="message" style={{ color: "green" }}>{message}</p>}
      <p className="login-link">
        Remember your password?<a href="/LogIn"> Go back to login</a>
      </p>
    </div>
  );
};

export default Forget;
