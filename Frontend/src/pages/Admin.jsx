import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/all');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing localStorage, etc.)
    navigate('/');
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    border: "1px solid #dee2e6",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
  };

  const tdStyle = {
    padding: "12px",
    border: "1px solid #dee2e6",
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      <div style={{ 
        position: "fixed", 
        top: "20px", 
        right: "20px", 
        zIndex: 1000 
      }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c0392b"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e74c3c"}
        >
          Logout
        </button>
      </div>
      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          backgroundColor: "#fff", 
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          border: "1px solid #dee2e6"
        }}>
          <thead>
            <tr>
              <th style={thStyle}>User Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Created At</th>
              <th style={{...thStyle, width: "80px"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.role}</td>
                  <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                  <td style={tdStyle}>
                    <button                      onClick={() => handleDelete(user.id)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#e74c3c",
                        border: "none",
                        padding: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s",
                      }}
                      title="Delete user"
                      onMouseOver={(e) => e.currentTarget.style.color = "#c0392b"}
                      onMouseOut={(e) => e.currentTarget.style.color = "#e74c3c"}
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={tdStyle}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin;
