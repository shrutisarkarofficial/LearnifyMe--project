import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed
import "../../style/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logoImage from "../../assets/LearnifyMe_logo(1).png";
import defaultProfile from "../../assets/download.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [userData, setUserData] = useState({ name: "", role: "" });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userid=localStorage.getItem("userId");
  const name=localStorage.getItem("name");
  const role=localStorage.getItem("role");
  //const profile=localStorage.getItem("profile");

//  useEffect(() => {
//   const fetchProfileImage = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8080/users/${userid}/profile-image-url`);
//       console.log(res.data.imageUrl);
      
//       setProfileImage(`http://localhost:8080${res.data.imageUrl}`);
//     } catch (error) {
//       console.error("Failed to load profile picture:", error);
//     }
//   };

//   fetchProfileImage();
// }, []);


const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePic", file);

  //const userId = localStorage.getItem("userId");

  try {
    await axios.post(`http://localhost:8080/users/${userid}/update-profilePic`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profile picture updated!");

    // Refresh image
    setProfileImage(URL.createObjectURL(file)); // OR re-fetch from backend
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    toast.error("Error uploading profile picture.");
  }
};
  const handleSignOut = async () => {
    localStorage.clear();
    const promise = new Promise((resolve) => {
      const toastId = toast.success('Signed out!', {
        position: "top-center",
        autoClose: 2000,
        onOpen: () => {
          // Short delay then resolve
          setTimeout(resolve, 2000);
        }
      });
    });
    
    await promise;
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" >
          <img src={logoImage} alt="LearnifyMe Logo" className="logo-icon" />
          LearnifyMe 
        </div>

        {/* Profile */}
        <div className="profile-container" ref={dropdownRef}>
          <img
            src={profileImage || defaultProfile}
            alt="Profile"
            className="profile-pic"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-profile-upload">
  <label htmlFor="profile-upload" className="upload-label">
    <img
      src={profileImage || defaultProfile}
      alt="Upload Profile"
      className="profile-pic-dropdown"
    />
    <p className="upload-text">Change Picture</p>
  </label>
  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: "none" }}
  />
</div>


              <p className="dropdown-item"><strong>Username:</strong> {name}</p>
              <p className="dropdown-item"><strong>Role:</strong> {role}</p>
              <button className="dropdown-item sign-out-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
    </>
  );
};

export default DashboardHeader;
