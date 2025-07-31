import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../componentes/layout/Header';
import Footer from '../componentes/layout/Footer';
import bgImage from "../assets/quiz.jpg"; // Adjust path if needed
import joinCourseGif from '../assets/JoinCourse.gif';
import examGif from '../assets/exam.gif';
import gemini from '../assets/Gemini.gif';

import "../style/style.css"; // Adjust path if needed
const Home = () => {
  return (
    <>
      <Header /> {/* Header stays at the top */}
     



    <div>   <br/><br/><br/>   <section
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          position: "relative",
          width: "100%",
          height: "102%",
        }}
      >
        <center>
          <br/><br/><br/><br/><br/>
          <h4>
            Welcome to <b className="i">LearnifyMe</b>
          </h4>
          <h1>“Your exam companion,<br /> powered by Arni</h1>
          <p className="home">----------------------------------------------------------------------------------------</p>
          <h5>- Innovate. Educate. Excel. </h5>
          
        </center>
        <br/><br/><br/><br/><br/><br/>
      </section>

      <center>
        <p className="e">
          Now we support every part of your lesson.
          <br />
          Here’s how it works
        </p>
      </center>

      <div className="mvv-container">
        <div className="mvv-block">
          <div className="image">
            <img src={joinCourseGif} alt="Join Course" className="img1" />
          </div>
          <div className="content">
            <h1 className="cont1">01</h1>
            <h2>
              Join Courses <br />
               across topics and expand your<br />
               knowledge effortlessly!
            </h2>
          </div>
        </div>

        <div className="mvv-block">
          <div className="image">
            <img src={examGif} alt="Join exam" className="img2" />
          </div>
          <div className="content">
            <h1 className="cont2">02</h1>
            <h2>
              Give exams on diverse <br />
              topics and expand your knowledge <br />
              effortlessly!
            </h2>
          </div>
        </div>

        <div className="mvv-block">
          <div className="image">
           <img src={gemini} alt="Gemini Course" className="img3" />
          </div>
          <div className="content">
            <h1 className="cont3">03</h1>
            <h2>
              seamlessly solve problems <br />
              <br />
              with the help of Arni <br />
              <br />
              - your learning AI assistant!
            </h2>
          </div>
        </div>
      </div>

      <div className="box">
        <br /><br /><br />
        <h2>
          Start adapting your curriculum in minutes.
          <b>
            <p>
              The best way to create, adapt, and deliver resources differentiated
              for every student.
            </p>
          </b>
        </h2>
        <br />
        <center>
          <Link to="/SignUp">
            <button className="f">
            
              <b className="s">Start your EXAM &gt;</b>
            </button>
          </Link>
        </center>
        <br /><br /><br />
        <p className="blank"><br /></p>
      </div>
    </div>



      <Footer /> {/* Footer at the bottom */}
    </>
  );
};

export default Home;
