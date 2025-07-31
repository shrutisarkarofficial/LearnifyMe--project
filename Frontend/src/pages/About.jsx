import React from 'react';
import Header from '../componentes/layout/Header';
import Footer from '../componentes/layout/Footer';
const About = () => {
  return (
    <>
      <Header /> {/* Header stays at the top */}
      <main style={{ marginTop: "80px", padding: "20px" }}> {/* Add some spacing */}
      <h1>About Us</h1>
      <p>Welcome to LearnifyMe! Your comprehensive e-learning platform for personalized education and growth.</p>
      </main>
      <Footer /> {/* Footer at the bottom */}
    </>
  );
};

export default About;
