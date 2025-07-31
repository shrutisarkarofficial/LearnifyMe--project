import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../componentes/layout/dashboardHeader";
import { FaPlus } from "react-icons/fa";
import "../style/StudentDashboard.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseCodeInput, setCourseCodeInput] = useState("");
  const [joinedCourses, setJoinedCourses] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userId");
  // const allCourses = [
  //   { code: "CS101", name: "Computer Science Basics", description: "Intro to CS", teacher: "Mr. Sharma" },
  //   { code: "MATH123", name: "Calculus I", description: "Differentiation & Integration", teacher: "Ms. Gupta" },
  //   { code: "PHY111", name: "Physics Fundamentals", description: "Mechanics and Waves", teacher: "Dr. Khan" },
  //   { code: "ENG202", name: "English Literature", description: "Classic and Modern Literature", teacher: "Mrs. Patel" },
  // ];
  console.log(studentId);
  const fetchJoinedCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/enrollments/student/${studentId}`);
      setJoinedCourses(response.data.courses); // ✅ Corrected here
    } catch (error) {
      console.error("Failed to fetch joined courses:", error);
    }
  };

  useEffect(() => {
  
  fetchJoinedCourses();
}, []);


  const handleJoinCourse = async () => {
  if (!courseCodeInput.trim()) {
    toast.error("Please enter a valid course code.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/api/enrollments/join", {
      studentId: studentId,
      courseCode: courseCodeInput.trim(),
    });

    if (response.data.status === "success") {
      toast.success(`Successfully joined course: ${response.data.courseTitle}`);
      setIsDialogOpen(false);
      setCourseCodeInput("");
      fetchJoinedCourses(); // Refresh the list of joined courses
      // Optionally refresh course list
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error joining course:", error);
    toast.error("An error occurred while joining the course.");
  }
};


  const handleCardClick = (course, bgColor) => {
    navigate("/course-dashboard", { state: { course, bgColor } }); // send bgColor too
  };
  return (
    <>
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
      <DashboardHeader />
      <div className="dashboard-container">
        <aside className="sidebar">
          <ul>
            <li className="sidebar-item" onClick={() => setIsDialogOpen(true)}>
              <FaPlus className="icon" />
              Join Course
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {joinedCourses.length === 0 && (
            <p>No courses joined yet. Click "Join Course" to get started.</p>
          )}
          <div className="joined-courses">
            {joinedCourses.map((course, index) => {
              const randomColors = [
                "#FFEBEE", "#E3F2FD", "#E8F5E9",
                "#FFF3E0", "#F3E5F5", "#E0F2F1",
              ];
              const bgColor = randomColors[Math.floor(Math.random() * randomColors.length)];
              return (
                <div
                  key={index}
                  className="joined-course-card"
                  style={{ backgroundColor: bgColor, cursor: "pointer" }}
                  onClick={() => handleCardClick(course, bgColor)} // ✅ Pass bgColor
                >
                  <h3>{course.course_name}</h3>
                  <p><strong>Teacher:</strong> {course.teacherName}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>JOIN COURSE</h2>
            <label htmlFor="courseCodeInput">ENTER COURSE CODE</label>
            <input
              id="courseCodeInput"
              type="text"
              value={courseCodeInput}
              onChange={(e) => setCourseCodeInput(e.target.value)}
              placeholder="Enter Course Code"
            />
            <div className="dialog-buttons">
              <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button onClick={handleJoinCourse}>Join</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default StudentDashboard;
