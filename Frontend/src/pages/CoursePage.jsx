import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/CoursePage.css";
import { FaUserGraduate, FaStickyNote, FaPlus, FaTrash, FaChartBar } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from '.././componentes/ChatBot';

const CoursePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, bgColor } = location.state || {};
  const courseId = course.id;
  const [activeTab, setActiveTab] = useState("Exam");
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [createdExams, setCreatedExams] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState({ total: 0, data: [] });
  const [examSubmissions, setExamSubmissions] = useState([]);
  const [examStatus, setExamStatus] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchExamSummaries = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exams/summary/${courseId}`);
        if (response.data && response.data.status === 'success') {
          setCreatedExams(response.data.data || []);
        } else {
          setCreatedExams([]);
        }
      } catch (error) {
        console.error("Failed to fetch exam summaries", error);
        setError("Failed to fetch exam summaries");
      }
    };

    fetchExamSummaries();
  }, []);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/enrollments/students/${courseId}`);
        if (response.data && response.data.status === 'success') {
          setEnrolledStudents({
            total: response.data.total,
            data: response.data.data
          });
        }
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
        toast.error('Failed to fetch enrolled students');
      }
    };

    fetchEnrolledStudents();
  }, [courseId]);

  useEffect(() => {
    const fetchExamSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exams/submissions/${courseId}`);
        if (response.data && response.data.status === 'success') {
          setExamSubmissions(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch exam submissions", error);
        //toast.error("Failed to fetch exam submissions");
      }
    };

    if (activeTab === "ViewScore") {
      fetchExamSubmissions();
    }
  }, [courseId, activeTab]);

  useEffect(() => {
    const fetchExamStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/exams/status/${courseId}`);
        setExamStatus(response.data);
      } catch (error) {
        console.error("Failed to fetch exam status", error);
        toast.error("Failed to fetch exam status");
      }
    };

    if (activeTab === "ViewScore") {
      fetchExamStatus();
    }
  }, [courseId, activeTab]);

   const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/enrollments/delete/${courseId}/${studentId}`);
        if (response.data && response.data.status === 'success') {
          setEnrolledStudents(prev => ({
            total: prev.total - 1,
            data: prev.data.filter(student => student.studentId !== studentId)
          }));
          toast.success('Student removed successfully');
        } else {
          toast.error('Failed to remove student');
        }
      } catch (error) {
        console.error('Error removing student:', error);
        toast.error('Failed to remove student');
      }
    }
  };

  const deleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/notes/delete/${courseId}/${noteId}`);
        if (response.data && response.data.status === 'success') {
          setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
          toast.success('Note deleted successfully');
        } else {
          toast.error('Failed to delete note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error(error.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  const [examData, setExamData] = useState({
    title: "",
    noOfQuestions: "",
    scheduledAt: "",
    courseId: "",
  });

  const [questionForm, setQuestionForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "",
    marks: 0, // <-- new field
  });

  
  if (!course) return <p>No course data provided.</p>;

  //dynamically loads the notes files
    useEffect(() => {
    axios
      .get(`http://localhost:8080/api/notes/all/${courseId}`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  }, [courseId]);

  

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

  const handleNoteUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1]; // Remove 'data:*/*;base64,'
        console.log(courseId);
        const file1={title: file.name,
          fileName: file.name,
          fileType: file.type,
          data: base64Data,
          courseId: courseId};
          console.log(file1);
          
      try {
        const response = await axios.post("http://localhost:8080/api/notes/upload", file1);

        // Assuming backend responds with a noteId or similar identifier
        const savedNote = response.data;

        setUploadedNotes([
          {
            name: savedNote.fileName,
            type: savedNote.fileType,
            id: savedNote.id, // Or whatever unique identifier your backend returns
            color: getRandomColor(),
          },
          ...uploadedNotes,
        ]);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    reader.readAsDataURL(file);
  }
};


  const getRandomColor = () => {
    const colors = ["#FFECB3", "#E1BEE7", "#C8E6C9", "#B3E5FC", "#F8BBD0", "#D1C4E9"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

 const ExamSummary = ({ courseId }) => {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');}


  const handleExamCreate = () => {
  const { title, noOfQuestions, scheduledAt } = examData;

  if (!title.trim() || !noOfQuestions || !scheduledAt) {
    toast.error("Please fill in all the fields before creating the exam.");
    return;
  }

  setShowExamModal(false);
  setShowQuestionModal(true);
};


  const handleQuestionChange = (field, value) => {
  if (field === "marks") {
    setQuestionForm({ ...questionForm, [field]: value === "" ? "" : Number(value) });
  } else {
    setQuestionForm({ ...questionForm, [field]: value });
  }
};

  const handleNextQuestion = () => {
  const { question, optionA, optionB, optionC, optionD, correctOption, marks } = questionForm;

  if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption || !marks) {
    toast.error("Please fill all fields before proceeding.");
    return;
  }

  setQuestions([...questions, questionForm]);
  setQuestionForm({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "",
    marks: "",
  });
  setCurrentQuestion(currentQuestion + 1);
};


 const handleFinishExam = async () => {
  const { question, optionA, optionB, optionC, optionD, correctOption, marks } = questionForm;

  if (
    !question.trim() ||
    !optionA.trim() ||
    !optionB.trim() ||
    !optionC.trim() ||
    !optionD.trim() ||
    !correctOption.trim() ||
    questionForm.marks === "" || isNaN(questionForm.marks)
  ) {
    toast.error("Please fill all fields before finishing.");
    return;
  }

  // Validate marks is a number
  const parsedMarks = parseInt(marks);
  if (isNaN(parsedMarks)) {
    toast.error("Marks must be a valid number.");
    return;
  }

  const updatedQuestions = [
    ...questions,
    {
      ...questionForm,
      marks: parsedMarks,
    },
  ];

  const payload = {
  title: examData.title,
  scheduledAt: examData.scheduledAt,
  courseId: courseId,
  questions: updatedQuestions.map((q) => ({
    question: q.question,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOption: q.correctOption,
    marks: parseInt(q.marks),
  })),
};

  console.log(payload);
  
  try {

    const response = await axios.post("http://localhost:8080/api/exams/create", payload);
    if (response.data.status === "success") {
      console.log("Exam Created:", response.data);

      setCreatedExams((prev) => [
        ...prev,
        {
          ...payload,
          submissions: 0,
          examId: response.data.examId,
        },
      ]);

      setShowQuestionModal(false);
      setExamData({ title: "", noOfQuestions: "", scheduledAt: "", courseId: "" });
      setQuestions([]);
      setCurrentQuestion(1);
      setQuestionForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "",
        marks: "",
      });

      setActiveTab(`Exam-${createdExams.length}`);
    } else {
      toast.error(response.data.message || "Failed to create exam.");
    }
  } catch (error) {
    console.error("Error creating exam:", error);
    toast.error("Server error while creating exam.");
  }
};



  const renderContent = () => {
    if (activeTab === "ViewScore") {
      return (
        <div className="score-section p-6">
  <h3 className="text-2xl font-semibold mb-6 text-purple-800 text-align-center">Exam Status</h3>

  <div className="score-table bg-white rounded-xl shadow-lg overflow-hidden">
    <table className="min-w-full table-auto">
      <thead className="bg-purple-100 text-purple-800">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Student Name</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Exam Title</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Score</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Status</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Submitted At</th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {examStatus.length > 0 ? (
          examStatus.map((status, index) => (
            <tr key={index} className={status.status === 'Submitted' ? 'submitted' : 'not-submitted'}>
  <td className="name">{status.studentName}</td>
  <td className="title">{status.examTitle}</td>
  <td className="score">
    {status.score !== null ? `${status.score}/${status.totalMarks}` : '-'}
  </td>
  <td className="badge">
    <span className={status.status === 'Submitted' ? 'submitted-badge' : 'not-submitted-badge'}>
      {status.status}
    </span>
  </td>
  <td className="submittedAt">
    {status.submittedAt ? new Date(status.submittedAt).toLocaleString() : '-'}
  </td>
</tr>

          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
              No exam status data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      );
    }

    if (activeTab === "Students") {      return (
        <div className="students-list p-6">
  <h2 className="text-xl font-bold mb-6 text-left">Enrolled Students</h2>
  {enrolledStudents.total > 0 ? (
    <div >
      <div className="student-row">
        {enrolledStudents.data.map((student) => (         
           <div
            key={student.studentId}
            className="student-card"
          >
            <div className="student-name">
              {student.studentName}
            </div>
            <div className="enrolled-datetime">
              {new Date(student.enrolledAt).toLocaleDateString('en-CA')}{" "}
              {new Date(student.enrolledAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
            <button
            className="delete-btn"
            onClick={() => handleDeleteStudent(student.studentId)}
          ><FaTrash />
          </button>
          </div>
        ))}
        
            
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-4">No students enrolled yet.</p>
  )}
</div>

      );
    }
if (activeTab === "Notes") {
  return (
    <div className="notes-section">
  <h2 className="text-xl font-bold mb-4">Uploaded Notes</h2>
  <div className="notes-grid">
    {notes.map((note) => (
      <div
        key={note.id}
        className="note-card flex items-center justify-between bg-white px-4 py-3 rounded shadow"
      >
        <div className="flex items-center gap-2">
          <span role="img" aria-label="file">📄</span>
          <span className="font-medium">{note.fileName}</span>
        </div>
        <div className="note-actions">
          {(note.fileType.includes("pdf") ||
            note.fileType.includes("msword") ||
            note.fileType.includes("officedocument") ||
            note.fileType.includes("presentationml")) && (
            <button
              className="view-btn"
              onClick={() => openFile(note.data, note.fileType)}
            >
              View File
            </button>
          )}
          <button
            className="delete-btn"
            onClick={() => deleteNote(note.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    ))}

    <label className="upload-box ">
      <input type="file" onChange={handleNoteUpload} hidden />
      <span className="upload-content">+ Upload New Note</span>
    </label>
  </div>
</div>

  );
}

 //default dashboard view
 if (activeTab === "Exam") {
  if (createdExams.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No exams created yet.</p>;
  }
  //view exams
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
  {createdExams && createdExams.length > 0 ? (
    createdExams.map((exams, idx) => (      <div
        key={idx}
        className="exam-list"
        onClick={() => setActiveTab(`Exam-${idx}`)}
      >
        
        <h2 className="text-xl font-bold mb-4">{exams.examName || 'Untitled Exam'}</h2>
        <p className="text-sm text-gray-600">
          Scheduled: {exams.scheduledAt ? new Date(exams.scheduledAt).toLocaleDateString() : 'Not Scheduled'}
        </p>
        <p className="text-sm text-gray-600">
          {exams.totalSubmissions ?? 0} submissions
        </p>
        <p className="text-sm font-medium text-blue-600">
          <br /> 
        </p>
      </div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">No exams created yet.</p>
  )}
</div>

  );
}


    //If activeTab matches one of the created exams (like "Exam-0", "Exam-1", ...)
    if (activeTab.startsWith("Exam-")) {
      const examIndex = parseInt(activeTab.split("-")[1], 10);
      const selectedExam = createdExams[examIndex];

      if (!selectedExam) return <p>Exam not found.</p>;

      return (
        <div className="exam-details">
          <h3>{selectedExam.title}</h3>
          <p><b>Scheduled at:</b> {new Date(selectedExam.scheduledAt).toLocaleString()}</p>
          {/* <p><b>Total Questions:</b> {selectedExam.questions.length}</p> */}
          <ol>
            {selectedExam.questions.map((q, i) => (
              <li key={i}>
                <p><b>Q:</b> {q.question} <span style={{ float: "right" }}>Marks: {q.marks}</span></p>

                <ul>
                  <li>A: {q.optionA}</li>
                  <li>B: {q.optionB}</li>
                  <li>C: {q.optionC}</li>
                  <li>D: {q.optionD}</li>
                </ul>
                <p><b>Correct:</b> {q.correctOption}</p>
                
              </li>
            ))}
          </ol>
        </div>
      );
    }

    return <p>Select an option from the sidebar to begin.</p>;
  };

 

  return (
    <div className="course-page-container">
      <nav className="course-navbar" style={{ backgroundColor: bgColor }}>
        <div className="nav-left">
          <h2 className="course-title">{course.coursename}</h2>
          <p className="course-desc">{course.description}</p>
        </div>
        <button onClick={() => navigate(-1)} className="back-button">Back</button>
      </nav>

      <div className="course-layout">
        <aside className="course-sidebar">
          <ul>
            <li onClick={() => setActiveTab("Students")} className={activeTab === "Students" ? "active" : ""}>
              <FaUserGraduate className="sidebar-icon" /> Students
            </li>
            <li onClick={() => setActiveTab("Notes")} className={activeTab === "Notes" ? "active" : ""}>
              <FaStickyNote className="sidebar-icon" /> Notes
            </li>

            {/* Render created exams above the Exam button */}
            {/* {createdExams?.map((exams, idx) => (
              <li
                key={idx}
                onClick={() => setActiveTab(`Exam-${idx}`)}
                className={activeTab === `Exam-${idx}` ? "active" : ""}
                style={{ fontWeight: "bold", cursor: "pointer" }}
                title={`Scheduled at: ${new Date(exams.scheduledAt).toLocaleString()}`}
              >
                📝 {exams.examName}
              </li>
            ))} */}

            <li
              onClick={() => {
                setActiveTab("Exam");
                setShowExamModal(true);
              }}
              className={activeTab === "Exam" ? "active" : ""}
            >
              <FaPlus className="sidebar-icon" /> Exam
            </li>
            <li onClick={() => setActiveTab("ViewScore")} className={activeTab === "ViewScore" ? "active" : ""}>
              <FaChartBar className="sidebar-icon" /> View Score
            </li>
          </ul>
        </aside>
      
        <main className="course-main-content bg-green-50">
          {renderContent()}
        </main>
      </div>
      {showExamModal && (
        <div className="exam-modal-overlay">
          <div className="exam-modal"> 
            <div className="modal-header">
              <h3>Create Exam</h3>
              <span className="close-btn" onClick={() => setShowExamModal(false)}>×</span>
            </div>
            <div className="modal-body">
              <label>Title</label>
              <input
                type="text"
                required
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
              />
              <label>No. of Questions</label>
              <input
                type="number"
                required
                value={examData.noOfQuestions}
                onChange={(e) => setExamData({ ...examData, noOfQuestions: e.target.value })}
              />
              <label>Scheduled At</label>
              <input
                type="datetime-local"
                required
                value={examData.scheduledAt}
                onChange={(e) => setExamData({ ...examData, scheduledAt: e.target.value })}
              />
              <button className="create-exam-btn" onClick={handleExamCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showQuestionModal && (
        <div className="exam-modal-overlay">
          <div className="exam-modal">
            <div className="modal-header">
              <h3>Question {currentQuestion}</h3>
              <span className="close-btn" onClick={() => setShowQuestionModal(false)}>×</span>
            </div>
            <div className="modal-body">
              <label>Question</label>
              <input
                type="text"
                value={questionForm.question}
                onChange={(e) => handleQuestionChange("question", e.target.value)}
              />
              <label>Option A</label>
              <input
                type="text"
                value={questionForm.optionA}
                onChange={(e) => handleQuestionChange("optionA", e.target.value)}
              />
              <label>Option B</label>
              <input
                type="text"
                value={questionForm.optionB}
                onChange={(e) => handleQuestionChange("optionB", e.target.value)}
              />
              <label>Option C</label>
              <input
                type="text"
                value={questionForm.optionC}
                onChange={(e) => handleQuestionChange("optionC", e.target.value)}
              />
              <label>Option D</label>
              <input
                type="text"
                value={questionForm.optionD}
                onChange={(e) => handleQuestionChange("optionD", e.target.value)}
              />
              <label>Correct Option</label>
              <select
                value={questionForm.correctOption}
                onChange={(e) => handleQuestionChange("correctOption", e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <label>Marks</label>
      <input
      type="number" min="1" value={questionForm.marks}
      onChange={(e) => handleQuestionChange("marks", e.target.value)}
      placeholder="Marks"
      />  

              <div className="modal-actions">
                {currentQuestion < parseInt(examData.noOfQuestions, 10) ? (
                  <button onClick={handleNextQuestion}>Next &gt;&gt;</button>
                ) : (
                  <button onClick={handleFinishExam}>Finish</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="chatbot-container"> 
<Chatbot courseName={course.courseName} description={course.coursedescription} role={role}/>
</div>
    </div>
  );
};

export default CoursePage;