import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Thesis from './pages/Thesis';
import Play from './pages/Play';
import About from './pages/About';
import './App.css';

function App() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCursorChange = useCallback((variant, element = null) => {
    setCursorVariant(variant);
    setHoveredElement(element);
  }, []);

  return (
    <Router>
      <div className="app">
        {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
        <Header setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} hoveredElement={hoveredElement} />
        <main>
          <Routes>
            <Route path="/" element={<Home setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />} />
            <Route path="/thesis" element={<Thesis setCursorVariant={setCursorVariant} />} />
            <Route path="/play" element={<Play setCursorVariant={setCursorVariant} />} />
            <Route path="/about" element={<About setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />} />
          </Routes>
        </main>
        <Footer setCursorVariant={setCursorVariant} />
      </div>
    </Router>
  );
}

export default App;
