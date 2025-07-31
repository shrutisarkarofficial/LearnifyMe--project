import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/ExamPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examid, bgColor } = location.state || {};
  const examIdFromStorage = localStorage.getItem("examId");
  const examId = examid || examIdFromStorage;
  const [answers, setAnswers] = useState({});
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = JSON.parse(localStorage.getItem("userId")) || localStorage.getItem("userId");
  const courseId = localStorage.getItem("courseId");

  console.log("ExamPage loaded with examId:", examId);
  console.log("Student ID from localStorage:", studentId);
  console.log("Course ID from localStorage:", courseId);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!examId) {
        console.error("No exam ID provided");
        toast.error("No exam ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching exam details for examId:", examId);
        const response = await axios.get(
          `http://localhost:8080/api/exams/details/${examId}`
        );
        console.log("Exam data received:", response.data);
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
        toast.error("Error loading exam details");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchExamDetails();
  }, [examId]);

  // Show loading state
  if (loading) {
    return (
      <div className="exam-wrapper" style={{ backgroundColor: bgColor || "#f4f4f4" }}>
        <div className="loading-state">
          <h2>Loading exam details...</h2>
        </div>
      </div>
    );
  }

  // Show error state if no examId
  if (!examId) {
    return (
      <div className="exam-wrapper" style={{ backgroundColor: bgColor || "#f4f4f4" }}>
        <div className="error-state">
          <h2>Error: No exam ID provided</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Show error state if no exam data
  if (!exam) {
    return (
      <div className="exam-wrapper" style={{ backgroundColor: bgColor || "#f4f4f4" }}>
        <div className="error-state">
          <h2>Error: Could not load exam data</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // If the exam data is in a nested structure, adjust the path
  const examData = exam.data || exam;
  if (!examData.questions) {
    console.log("Exam structure is:", examData);
    return (
      <div className="exam-wrapper" style={{ backgroundColor: bgColor || "#f4f4f4" }}>
        <div className="error-state">
          <h2>Error: No questions found in exam</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };
  const handleSubmit = async () => {
    try {
      // Get studentId from localStorage (you might need to adjust this based on how you store user data)
      
      if (!studentId) {
        toast.error("Student ID not found. Please log in again.");
        return;
      }

      // Prepare the submission data
      const submissionData = {
        studentId,
        examId,
        answers: answers
      };

      console.log('Submitting exam data:', submissionData);

      // Send the data to the backend
      const response = await axios.post('http://localhost:8080/api/exams/submit', submissionData);

      if (response.data) {
        // Save submission status to localStorage
        const submittedExams = JSON.parse(localStorage.getItem("submittedExams")) || {};
        submittedExams[examId] = {
          submitted: true,
          answers,
          timestamp: Date.now(),
        };
        localStorage.setItem("submittedExams", JSON.stringify(submittedExams));

        toast.success("Exam submitted successfully!", {
          position: "middle-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        
        navigate(-1); // Navigate to course dashboard with courseId and bgColor
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error(error.response?.data?.message || "Failed to submit exam. Please try again.");
    }
  };

  return (
    <div
      className="exam-wrapper"
      style={{ backgroundColor: bgColor || "#f4f4f4" }}
    >
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
      {exam.data && (
  <div className="exam-header">
    <h2>
      {exam.data.examName} - {exam.data.courseName}
    </h2>
    <p>{exam.data.courseDescription}</p>
    <div className="total-marks-badge">
      Total Marks: {exam.data.totalMarks}
    </div>
  </div>
)}

      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
>
  {exam.data?.questions.map((q, index) => (
    <div className="question-box" key={q.questionId}>
      <div className="question-top">
        <div className="question-text">
          {index + 1}. {q.questionText}
        </div>
        <div className="question-marks">({q.marks} Marks)</div>
      </div>

      <div className="options-section">
        {['A', 'B', 'C', 'D'].map((opt, idx) => {
          const optionKey = `option${opt}`;
          return (
            <label key={idx} className="option-line">
              <input
                type="radio"
                name={q.questionId}
                value={q[optionKey]}
                checked={answers[q.questionId] === q[optionKey]}
                onChange={() => handleOptionChange(q.questionId, q[optionKey])}
                required
              />
              <span>{q[optionKey]}</span>
            </label>
          );
        })}
      </div>
    </div>
  ))}

  <button type="submit" className="submit-btn">
    Submit Exam
  </button>
</form>
    </div>
  );
};

export default ExamPage;
