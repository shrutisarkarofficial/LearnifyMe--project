import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/CourseDashboard.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from '.././componentes/ChatBot';

const CourseDashboard = () => {
  // Navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { course, bgColor } = location.state || {};
  const courseId = localStorage.setItem("courseId", course?.id) || localStorage.getItem("courseId");
  const studentId = localStorage.getItem("userId");
  const courseName = course?.course_name;
  const coursedescription = course?.description ;
  const role = localStorage.getItem("role");
 

  // State management
  const [activeTab, setActiveTab] = useState("Notes");
  const [notes, setNotes] = useState([]);
  const [exams, setExams] = useState([]);
  const [examDetails, setExamDetails] = useState({}); // New state for exam details
  const [error, setError] = useState(null);

  // Common constants
  const now = new Date();

  // Helper functions
  const getExamStatus = (exam) => {
    const examDetail = examDetails[exam.examId];
    const isSubmitted = examDetail?.submissionStatus === "submitted";
    const examTime = new Date(exam.scheduledAt);
    const isUpcoming = now < examTime;
    const isDisabled = isSubmitted || isUpcoming;
    return {
      isSubmitted,
      examTime,
      isUpcoming,
      isDisabled,
      statusLabel: isSubmitted ? "DONE" : isUpcoming ? "UPCOMING" : "OPEN",
      cardColorClass: isSubmitted ? "green" : isUpcoming ? "blue" : "yellow",
      score: examDetail?.score || 0,
      total: examDetail?.examTotal || 0
    };
  };
    

  const formatExamDateTime = (date) => {
    const examDate = new Date(date);
    return {
      dateOnly: examDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      timeOnly: examDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };
  };

  const handleExamClick = (exam) => {
    const status = getExamStatus(exam);
    if (!status.isDisabled) {
      const examId=localStorage.setItem("examId", exam.examId) || localStorage.getItem("examId");
      console.log("Navigating to exam with ID:", examId);
      navigate(`/exam/${exam.examId}`, {
        state: {
          exam,
          course,
          bgColor,
        },
      });
    }
  };

  const openFile = (base64Data, fileType) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(
        [...byteCharacters].map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: fileType || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening file:", error);
      toast.error("Failed to open file. Try again.");
    }
  };

  // Dynamically loads the notes files
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/notes/all/${courseId}`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, []);
  // Fetch exams for the course
  useEffect(() => {
    const fetchExamsByCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exams/student/${courseId}/${studentId}`);
        if (response.data && response.data.status === 'success') {
          console.log("Fetched exams:", response.data.data);
          
          setExams(response.data.data || []);
          
          // Create a map of exam details indexed by examId
          const examDetailsMap = {};
          response.data.data.forEach(exam => {
            examDetailsMap[exam.examId] = {
              examTotal: exam.examTotal,
              score: exam.score,
              submissionStatus: exam.submissionStatus,
              scheduledAt: exam.scheduledAt
            };
          });
          setExamDetails(examDetailsMap);
        } else {
          setExams([]);
          setExamDetails({});
          setError('No exams found for this course.');
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to fetch exams.');
        setExams([]);
        setExamDetails({});
      }
    };

    if (courseId) {
      fetchExamsByCourse();
    }
  }, [courseId]);

  if (!course) return <p>No course selected.</p>;

  return (
    <div className="course-dashboard">
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
      {/* Header */}
    <div
  className="dashboard-header"
  style={{
    backgroundColor: bgColor || "#f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    position: "relative",
  }}
>
  {/* Back Button */}
  <button
    onClick={() => navigate("/studentDashboard")}
    style={{
      padding: "8px 12px",
      backgroundColor: "#333",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    ← Back
  </button>

  {/* Header Center: Course Name and Description */}
  <div
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
    }}
  >
    {console.log("111", course)}
    
    <h2 style={{ marginBottom: "5px" }}>{course.course_name}</h2>
    <p style={{ marginTop: "0px", fontSize: "16px", color: "#555" }}>
      {course.description}
    </p>
  </div>

  {/* Teacher Info */}
  <div className="header-right" style={{ textAlign: "right" }}>
    <p className="teacher-label" style={{ marginBottom: "5px" }}>Teacher</p>
    <p className="teacher-name" style={{ fontWeight: "bold" }}>{course.teacherName}</p>
  </div>
</div>



      {/* Body */}
      <div className="dashboard-body" style={{ display: "flex" }}>
        {/* Sidebar */}
        {/* Sidebar */}
<aside className="sidebar">
  <ul>
    <li
      className={activeTab === "Notes" ? "active" : ""}
      onClick={() => setActiveTab("Notes")}
    >
      Notes
    </li>    {exams.map((exam) => {
  const examStatus = getExamStatus(exam);
  const examDetail = examDetails[exam.examId];

  return (
    <li
      key={exam.examId}
      className={`${activeTab === exam.examName ? "active" : ""} ${examStatus.isDisabled ? "disabled-exam" : ""}`}
      style={{
        cursor: examStatus.isDisabled ? "not-allowed" : "pointer",
        color: examStatus.isSubmitted ? "green" : examStatus.isUpcoming ? "blue" : "inherit",
        textDecoration: examStatus.isSubmitted ? "line-through" : "none",
        opacity: examStatus.isDisabled ? 0.9 : 1,
      }}
      onClick={() => {
        if (!examStatus.isDisabled) {
          setActiveTab(exam.examName);
          handleExamClick(exam);
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{exam.examName}</span>
        <span style={{ fontSize: "0.8em", marginLeft: "10px" }}>
          {examStatus.isSubmitted && `(${examDetail.score}/${examDetail.examTotal})`}
          {examStatus.isSubmitted && " ✔️"}
          {examStatus.isUpcoming && " 🕒"}
        </span>
      </div>
    </li>
  );
})}    <li
      className={activeTab === "ViewScore" ? "active" : ""}
      onClick={() => setActiveTab("ViewScore")}
    >
      View Score
    </li>
  </ul>
</aside>


        {/* Main Content */}
        <main
          className="main-section"
          style={{
            padding: "10px",
            flexGrow: 1,
            minHeight: "80vh",
          }}
        >
          {/* Notes tab */}
          {activeTab === "Notes" && (
            <div className="notes-list">
              <h3>Course Notes</h3>
              <ul>
                {notes.map((note, index) => (
                  <li key={index}>
                    📄 {note.title} —{" "}
                    <a
                      href={'#'}
                      onClick={() => openFile(note.data, note.fileType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "10px" }}
                    >
                      Open
                    </a>
                    {/* <button
                className="text-blue-500 hover:underline"
                onClick={() => openFile(note.data, note.fileType)}
              >
                View File
              </button> */}
                   
                  </li>
                ))}
              </ul>
            </div>
          )}          {/* View Score Tab */}
          {activeTab === "ViewScore" && (
            <div className="score-section" style={{ width: "100%" }}>
              <h3>Your Scores</h3>              <table
                className="score-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "left" }}>
                      Exam Name
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                      Total Marks
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                      Your Score
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                      Status
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                      Scheduled Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => {
                    const examDetail = examDetails[exam.examId];
                    const { dateOnly } = formatExamDateTime(exam.scheduledAt);
                    const status = examDetail?.submissionStatus === "submitted" 
                      ? "Completed"
                      : new Date() < new Date(exam.scheduledAt)
                      ? "Upcoming"
                      : "Open";
                    
                    const statusColor = status === "Completed" 
                      ? "#28a745" 
                      : status === "Upcoming"
                      ? "#007bff"
                      : "#ffc107";

                    return (
                      <tr key={exam.examId} style={{ 
                        borderBottom: "1px solid #dee2e6",
                        backgroundColor: status === "Completed" ? "#f8fff8" : "white"
                      }}>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px" }}>
                          {exam.examName}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                          {examDetail?.examTotal || 0}
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                          {status === "Completed" ? examDetail?.score : "-"}
                        </td>
                        <td style={{ 
                          border: "1px solid #dee2e6", 
                          padding: "12px", 
                          textAlign: "center"
                        }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: statusColor,
                            color: "white",
                            fontSize: "0.9em"
                          }}>
                            {status}
                          </span>
                        </td>
                        <td style={{ border: "1px solid #dee2e6", padding: "12px", textAlign: "center" }}>
                          {dateOnly}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
             
            </div>
          )}
        </main>

        {/* Right Exam Status */}
       <div className="exam-status">
  {exams.map((exam) => {
  const status = getExamStatus(exam);
  const { dateOnly, timeOnly } = formatExamDateTime(exam.scheduledAt);

  return (
    <div
      key={exam.id}
      className={`exam-card ${status.cardColorClass}`}
      onClick={() => {
        if (!status.isDisabled) handleExamClick(exam);
      }}
      style={{
        cursor: status.isDisabled ? "not-allowed" : "pointer",
        opacity: status.isDisabled ? 0.6 : 1,
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    fontFamily: "Arial",
  }}
>
  
</div>
<div className="exam-card-row">
  <div className="exam-name">{exam.examName}</div>
  <div className="exam-date">{dateOnly}</div>
  <div className="exam-time">{timeOnly}</div>
  <div className="exam-status-label">{status.statusLabel}</div>
</div>
  {console.log("Exam Name:", exam.examName)}
  {console.log("Exam ID:", exam.examId)}
  {console.log("Scheduled At:", exam.scheduledAt)}
  {console.log("Exam Status:", status.statusLabel)}
  
  
  
   
    </div>
  );
})}
<div className="chatbot-container"> 
<Chatbot courseName={courseName} description={coursedescription} role={role}/>
</div>
</div>

        </div>
      </div>
    
  );
};

export default CourseDashboard;
