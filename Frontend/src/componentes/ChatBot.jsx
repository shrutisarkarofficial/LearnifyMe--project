import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import '../style/ChatBot.css';

const formatBotMessage = (text) => {
  // Replace **text** with bold
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Replace __text__ with underline
  formattedText = formattedText.replace(/__(.*?)__/g, '<u>$1</u>');
  // Replace \n with line breaks
  formattedText = formattedText.replace(/\n/g, '<br>');
  return formattedText;
};

const Chatbot = ({courseName, description}) => {
  
  const [isOpen, setIsOpen] = useState(false);  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m Arni, your learning assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
  if (!input.trim()) return;

  const newMessage = { sender: 'user', text: input.trim() };
  setMessages(prev => [...prev, newMessage]);

  try {
    const res = await fetch("http://localhost:8080/api/gemini/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseName,
        courseDescription: description,
        query: input.trim(),
      }),
    });

    const data = await res.json();

    const botResponse = data?.text || "Sorry, I couldn't fetch a response.";

    setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
  } catch (err) {
    console.error("Error fetching chatbot response:", err);
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: "Oops! Something went wrong. Please try again later." },
    ]);
  }

  setInput('');
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button onClick={toggleChat} className="chat-toggle-button">
          <FiMessageSquare size={24} />
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h4>Arni</h4>
            <button onClick={toggleChat} className="chat-close-button">
              <FiX size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                dangerouslySetInnerHTML={{
                  __html: msg.sender === 'bot' ? formatBotMessage(msg.text) : msg.text
                }}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
