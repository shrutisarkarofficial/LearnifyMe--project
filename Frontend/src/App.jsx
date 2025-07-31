import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Forget from "./pages/Forget";
import Get_Otp from "./pages/Get_Otp";
import ChangePassword from "./pages/ChangePassword";
import TeacherDashboard from "./pages/teacherDashboard";
import CoursePage from "./pages/CoursePage";
import CourseDashboard from "./pages/CourseDashboard";
import StudentDashboard from "./pages/studentDashboard";
import ExamPage from "./pages/ExamPage";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Get_Otp" element={<Get_Otp/>}/>
        <Route path="/ChangePassword" element={<ChangePassword />} />

        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
        <Route path="/course" element={<CoursePage />} />
         <Route path="/course-dashboard" element={<CourseDashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
