import React from 'react';
import Header from '../componentes/layout/Header';
import Footer from '../componentes/layout/Footer';
const Contact = () => {
  return (
    <>
      <Header /> {/* Header stays at the top */}
      <main style={{ marginTop: "80px", padding: "20px" }}> {/* Add some spacing */}
      <h1>Contact Us</h1>
        <p style={{ marginTop: "10px" }}>
          Have questions, feedback, or need help? We'd love to hear from you!
        </p>

        <section style={{ marginTop: "30px" }}>
  <div className="contact-row">
    <h2>📧 Email</h2>
    <p>support@learnifyme.com</p>
  </div>

  <div className="contact-row">
    <h2>📞 Phone</h2>
    <p>+1 (123) 456-7890</p>
  </div>

  <div className="contact-row">
    <h2>🏢 Address</h2>
    <p>123 Main Street<br />Cityville, Country 12345</p>
  </div>

  <h2 style={{ marginTop: "40px" }}>💬 Send us a message</h2>
  <form className="contact-form">
    <input type="text" placeholder="Your Name" required />
    <input type="email" placeholder="Your Email" required />
    <textarea placeholder="Your Message" rows="5" required></textarea>
    <button type="submit">Send Message</button>
  </form>
</section>

      </main>
      <Footer /> {/* Footer at the bottom */}
    </>
  );
};

export default Contact;
