import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/SignUpAndLogInAndForget.css";
import googleLogo from "../assets/googleLogo.png";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    password: "",
    confirmPassword: "",
    profile: "hello"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  //const countryCodes = ["+1", "+44", "+91", "+61", "+81", "+33", "+49", "+86"];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateForm({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = (updatedFormData) => {
    let newErrors = {};

    // Name validation: Only alphabets and spaces, min length 3
    if (!updatedFormData.name.trim()) newErrors.name = "Name is required";
    else if (!/^[A-Za-z\s]{3,}$/.test(updatedFormData.name))
      newErrors.name =
        "Name should have at least 3 characters and contain only letters and spaces";

    // Email validation: Standard email pattern
    if (!updatedFormData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedFormData.email))
      newErrors.email = "Invalid email address";


    // Password validation: Min 6 chars, one uppercase, one lowercase, one digit, one special character
    if (!updatedFormData.password) newErrors.password = "Password is required";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        updatedFormData.password
      )
    )
      newErrors.password =
        "Password must be at least 6 characters long, include uppercase, lowercase, digit, and special character";

    // Confirm Password validation
    if (!updatedFormData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (updatedFormData.password !== updatedFormData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      try {
        const response = await axios.post("http://localhost:8080/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmpassword: formData.confirmPassword,
          role: formData.role.toUpperCase(),
          profile:formData.profile // Send as "STUDENT" or "TEACHER"
        });
  
        toast.success(response.data);
        console.log("A:", response.data); // Store token if needed
        navigate("/"); // Redirect after sign-up
      } catch (error) {
        toast.error("Sign-up failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div class="full-screen-container">
      <div class="left-half">
        <div className="signup-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            
             {/* New Role Section */}
            <div className="role-group">
  <label className="role-label">Role:</label>
  <div className="role-options-wrapper">
    <div className="role-options">
      <label>
        <input
          type="radio"
          name="role"
          value="student"
          checked={formData.role === "student"}
          onChange={handleChange}
        />
        Student
      </label>
      <label>
        <input
          type="radio"
          name="role"
          value="teacher"
          checked={formData.role === "teacher"}
          onChange={handleChange}
        />
        Teacher
      </label>
    </div>
    {errors.role && <p className="error role-error">{errors.role}</p>}
  </div>
</div>

            <div className="password-input-container">
              <label>Password:</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a strong Password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="password-input-container">
              <label>Confirm Password:</label>
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Rewrite Your Password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit">Sign Up</button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/LogIn">Login</a>
          </p>
          <p className="login-link">
            Want To Go Back<a href="/Home"> Home?</a>
          </p>
        </div>
      </div>
      <div class="right-half"></div>
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
    </div>
  );
};

export default SignUp;
