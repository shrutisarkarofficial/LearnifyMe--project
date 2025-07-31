import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Get_Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if we have state from the Forget page
    if (location.state?.email && location.state?.token) {
      setEmail(location.state.email);
      setToken(location.state.token);
      setShowOtpInput(true); // Show OTP input directly
    }
  }, [location]);

  // Handle input change for OTP fields
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = e.target.parentNode.children[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    fetch("http://localhost:8080/users/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        token: token
      }),
    })
    .then((res) => {
      if (res.ok) {
        toast.success("OTP verified successfully!");
        // Navigate to ChangePassword page with necessary state
        navigate("/ChangePassword", {
          state: {
            email: email,
            token: token,
            verified: true
          }
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    })
    .catch((err) => {
      console.error("OTP Verification Error:", err);
      toast.error("An error occurred. Please try again later.");
    });
  };

  // Handle resend OTP
  const handleResendOtp = (e) => {
    e.preventDefault();
    
    fetch("/sendOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    .then((res) => {
      if (res.ok) {
        toast.success("New OTP sent to your email!");
        setOtpValues(['', '', '', '', '', '']); // Reset OTP inputs
      } else {
        toast.error("Error sending OTP. Please try again.");
      }
    })
    .catch((err) => {
      console.error("OTP Send Error:", err);
      toast.error("An error occurred. Please try again later.");
    });
  };

  return (
    <>
    <style>{`
        /* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Container for the OTP form */
.container_otp {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Header */
.container_otp h2 {
  color: #333;
  margin-bottom: 10px;
}

.container_otp p {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

/* Input group */
.input-group_otp label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}

.otp-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

/* OTP Inputs */
.otp-inputs input {
  width: 50px;
  height: 55px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 10px;
  transition: 0.3s;
}

.otp-inputs input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
}

/* Button */
.btn_otp {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #800080;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.btn_otp:hover {
  background-color:rgb(199, 95, 220);
}

/* Resend OTP */
.back-link_otp {
  margin-top: 15px;
  font-size: 14px;
}

.back-link_otp a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.back-link_otp a:hover {
  text-decoration: underline;
}
      `}</style>
     
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container_otp">
        <h2 id="two">Enter OTP</h2>
        <p>We've sent an OTP to your email. Please enter it below to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group_otp">
            <label htmlFor="otp1">Enter OTP</label>
            <div className="otp-inputs">
              {[1, 2, 3, 4, 5, 6].map((num, idx) => (
                <input
                  key={num}
                  type="text"
                  id={`otp${num}`}
                  name={`otp${num}`}
                  maxLength={1}
                  required
                  value={otpValues[idx]}
                  onChange={(e) => handleInput(e, idx)}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn_otp">Verify OTP</button>
        </form>
        <div className="back-link_otp">
          <p>
            Didn't receive the OTP? <a href="#" onClick={handleResendOtp}>Resend OTP</a>
          </p>
        </div>
      </div>
    </div>
     </>
  );
};

export default Get_Otp;
