import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import "../style/SignUpAndLogInAndForget.css";
import axios from 'axios';
import TeacherDashboard from './teacherDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateForm({ ...formData, [e.target.name]: e.target.value})
  };

  // Form validation
  const validateForm = (updatedFormData) => {
    let newErrors = {};

    // Email validation
    if (!updatedFormData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedFormData.email))
      newErrors.email = 'Invalid email address';

    // Password validation
    if (!updatedFormData.password) newErrors.password = 'Password is required';
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(updatedFormData.password)
    )
      newErrors.password =
        'Password must be at least 6 characters long, include uppercase, lowercase, digit, and special character';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm(formData)) {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', formData);
        console.log(response.data);

        if (response.data.status === 'Success') {
          // Store user data first
          if (response.data.userdata.role === "TEACHER" || response.data.userdata.role === "STUDENT") {
            localStorage.setItem("userId", response.data.userdata.userid);
            localStorage.setItem("name", response.data.userdata.name);
            localStorage.setItem("role", response.data.userdata.role);
          }

          // Show success toast and handle navigation after
          const promise = new Promise((resolve) => {
            toast.success('Login successful!', {
              onClose: () => {
                resolve();
                if (response.data.userdata.role === "TEACHER") {
                    navigate("/teacherDashboard");
                } else if (response.data.userdata.role === "STUDENT") {
                    navigate("/studentDashboard");
                } else if (response.data.userdata.role === "ADMIN") {
                     navigate("/admin");
                }
              }
            });
          });

          // Wait for toast and navigation
          await promise;
        } else {
          toast.error(`Login failed: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Something went wrong during login: ' + (error.response?.data?.message || error.message));
      }
    }
  };


  return (
    <div className="full-screen-container">      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
      <div className="right-half"></div>
      <div className="left-half">
        <div className="signup-container">
          <h2>Log In</h2>
          
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
              />
              {/* Display error message below input */}
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="password-input-container">
              <label>Password:</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Display error message below input */}
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <p className="forget-link">
             <a href="/Forget">Forget Password?</a>
          </p>
            <button type="submit">Log In</button>
          </form>
          <p className="login-link">
            Want To Create A New Account? <a href="/SignUp">Sign Up</a>
          </p>
          <p className="login-link">
            Want To Go Back<a href="/Home"> Home?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
