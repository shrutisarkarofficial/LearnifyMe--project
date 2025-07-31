import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Verify that we have the required state from OTP verification
  useEffect(() => {
    if (!location.state?.verified || !location.state?.email || !location.state?.token) {
      toast.error("Please verify your OTP first");
      navigate("/forget");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== reNewPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: location.state.email,
          password: newPassword
        }),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to change password");
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f1f3f6;
        }

        .container_newpass {
          background-color: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 25vw;
          max-width: 1600px;
          margin: 100px auto;
        }

        #three {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          color: #333;
        }

        .label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
          color: #333;
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          margin-top: 8px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .error {
          color: red;
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
        }

        .btn_newpass {
          margin-top: 25px;
          width: 100%;
          padding: 12px;
          background-color:rgb(166, 8, 239);
          color: white;
          border: none;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn_newpass:hover {
          background-color:rgb(207, 23, 244);
        }

        @media (max-width: 768px) {
          .container_newpass {
            width: 80vw;
            margin: 50px auto;
          }
        }
      `}</style>

      <div className="container_newpass">
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
        <h2 id="three">Change Password</h2>
        <form id="passwordForm" onSubmit={handleSubmit}>
          <label className="label" htmlFor="newPassword">Enter New Password:</label>
          <input
            type="password"
            id="newPassword"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
          />

          <label className="label" htmlFor="reNewPassword">Re-enter New Password:</label>
          <input
            type="password"
            id="reNewPassword"
            className="input"
            value={reNewPassword}
            onChange={(e) => setReNewPassword(e.target.value)}
            required
            minLength="6"
          />

          {errorMessage && <div className="error">{errorMessage}</div>}

          <button type="submit" className="btn_newpass">
            Change Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
