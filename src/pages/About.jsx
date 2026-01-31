import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import './About.css';

const About = ({ setCursorVariant, handleCursorChange }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Karen's AI assistant. Feel free to ask me anything about Karen's work, background, or design philosophy!",
    },
  ]);

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');
  
  const handleTextEnter = useCallback((e) => {
    if (handleCursorChange) {
      handleCursorChange('text', e.currentTarget);
    } else {
      setCursorVariant('text');
    }
  }, [handleCursorChange, setCursorVariant]);

  const handleTextLeave = useCallback(() => {
    if (handleCursorChange) {
      handleCursorChange('default', null);
    } else {
      setCursorVariant('default');
    }
  }, [handleCursorChange, setCursorVariant]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    // Simulated AI response
    setTimeout(() => {
      const responses = [
        "Karen is a product designer with a background in architecture. She specializes in turning complex problems into intuitive, human-centered solutions.",
        "Karen completed her Master's at Northwestern, where she focused on minimizing overproduction in fashion retail brands.",
        "Her design approach combines strategic thinking with empathy, always keeping the end user at the center of the process.",
        "Karen has interned at major companies like Kroger and Dick's Sporting Goods, working on impactful product design challenges.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
  };

  const skills = [
    'Product Design',
    'UX Research',
    'Service Design',
    'Design Strategy',
    'Prototyping',
    'User Testing',
    'Architecture',
    'Visual Design',
  ];

  return (
    <div className="about-page" id="aboutme">
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-content">
          <div className="about-image-section">
            <motion.div
              className="about-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <img
                src="https://framerusercontent.com/images/CTmSY8MITcYG5EkE8CeIlxzGbSM.png?scale-down-to=512"
                alt="Karen Kodera"
              />
            </motion.div>
          </div>

          <div className="about-text-section">
            <motion.h1
              className="about-title"
              data-cursor-text
              onMouseEnter={handleTextEnter}
              onMouseLeave={handleTextLeave}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              About Karen
            </motion.h1>
            
            <motion.p
              className="about-bio"
              data-cursor-text
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              onMouseEnter={handleTextEnter}
              onMouseLeave={handleTextLeave}
              whileHover={{ scale: 1.01 }}
            >
              I'm a product designer and strategic thinker with a background in architecture.
              I specialize in turning complex problems into intuitive, human-centered solutions.
            </motion.p>

            <motion.p
              className="about-bio"
              data-cursor-text
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onMouseEnter={handleTextEnter}
              onMouseLeave={handleTextLeave}
              whileHover={{ scale: 1.01 }}
            >
              My design process is rooted in empathy and research, ensuring that every solution 
              addresses real user needs while achieving business objectives. I believe in the power 
              of design to create meaningful change.
            </motion.p>

            <motion.div
              className="skills-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h3>Skills & Expertise</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="chat-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="chat-title">Chat with Karen's AI Assistant</h2>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`chat-message ${message.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.content}
              </motion.div>
            ))}
          </div>
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Karen's work..."
              className="chat-input"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <motion.button
              type="submit"
              className="chat-send-btn"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
