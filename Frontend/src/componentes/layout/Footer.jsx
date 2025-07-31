import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa"; // Import social icons

const Footer = () => {
  return (
    <footer style={{ 
      textAlign: "center", 
      padding: "15px", 
      marginTop: "20px", 
      background: "hsl(276, 86.60%, 32.20%)"
    }}>
      
      {/* Social Media Icons */}
      <div style={{ marginBottom: "10px" }}>
        <FaTwitter style={iconStyle} />
        <FaEnvelope style={iconStyle} />
        <FaFacebook style={iconStyle} />
        <FaInstagram style={iconStyle} />
      </div>

      {/* Footer Text */}
      <p style={{ color: "white", fontSize: "18px" }}>
        © 2024 LearnifyMe. All rights reserved.
      </p>
    </footer>
  );
};

// Icon styling
const iconStyle = {
  color: "white",
  fontSize: "24px",
  margin: "0 10px",
  cursor: "pointer"
};

export default Footer;
