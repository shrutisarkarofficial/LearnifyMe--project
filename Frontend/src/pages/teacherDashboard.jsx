import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import DashboardHeader from "../componentes/layout/dashboardHeader";
import "../style/Header.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!teacherId) {
          toast.error('User not authenticated. Please log in again.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/courses/teacher/${teacherId}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        if (error.response) {
          // Handle specific API error responses
          const errorMessage = error.response.data.message || 'Failed to fetch courses';
          toast.error(errorMessage);
        } else if (error.request) {
          // Handle network errors
          toast.error('Network error. Please check your connection.');
        } else {
          // Handle other errors
          toast.error('Failed to fetch courses. Please try again later.');
        }
      }
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    const newErrors = {};
    if (!courseName.trim()) newErrors.courseName = "Course Name field is required";
    if (!courseCode.trim()) newErrors.courseCode = "Course Code field is required";
    if (!description.trim()) newErrors.description = "Course Description field is required";
    if (courseCode.length < 3) newErrors.courseCode = "Course code must be at least 3 characters long";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Show toast for validation errors
      Object.values(newErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/courses/create", {
        name: courseName,
        code: courseCode,
        description: description,
        teacherId: teacherId,
      });

      const createdCourse = response.data;
      const objectData = {
        id: createdCourse.id,
        coursename: createdCourse.name,
        courseCode: createdCourse.code,
        description: createdCourse.description,
        teacherId: createdCourse.teacherId,
      };
      
      setCourses((prevCourses) => [...prevCourses, objectData]); 
      setCourseName("");
      setCourseCode("");
      setDescription("");
      setIsDialogOpen(false);
      toast.success('Course created successfully!');
    } catch (error) {
      console.error("Course creation failed:", error);
      if (error.response) {
        // Handle specific API error responses
        const errorMessage = error.response.data.message || 'Failed to create course';
        toast.error(errorMessage);
      } else if (error.request) {
        // Handle network errors
        toast.error('Network error. Please check your connection.');
      } else {
        // Handle other errors
        toast.error('Failed to create course. Please try again later.');
      }
    }
  };

  return (
    <>
      <DashboardHeader />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li
              className="sidebar-item"
              style={{ color: "black", textDecoration: "none" }}
              onClick={() => setIsDialogOpen(true)}
            >
              <FaPlus className="icon" />
              New Course
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="courses-wrapper">
           {courses.map((course, index) => {
  const colors = ["#E0F7FA", "#FCE4EC", "#FFF9C4", "#E8F5E9", "#F3E5F5", "#FFECB3"];
  const bgColor = colors[index % colors.length];

  return (
   <div
  className="course-card"
  key={index}
  style={{ backgroundColor: bgColor, cursor: "pointer" }}
  onClick={() =>
    navigate("/course", {
      state: {
        course: course,
        courseId: course.id,
        bgColor: bgColor,
      },
    })
  }
>
  <h3>{course.coursename}</h3>
  <p><strong>Code:</strong> {course.courseCode}</p>
</div>

  );
})}

          </div>
        </main>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Create Course</h2>
            <input
              type="text"
              placeholder="Course Name *"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            {errors.courseName && (
              <p className="error">{errors.courseName}</p>
            )}
            <input
              type="text"
              placeholder="Course Code *"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <textarea
              placeholder="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="dialog-buttons">
              <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button onClick={handleCreateCourse}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard;