import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero, { CONTACT_LINKS, RESUME_URL } from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import PasswordGate from '../components/PasswordGate';
import ScrollRuler from '../components/ScrollRuler';
import { PLAY_PROJECTS, PlayModal, PlayCard } from './Play';
import { WORK_PROJECTS } from '../data/workProjects';
import { scrollHomeTo } from '../utils/scrollHome';
import './About.css';
import './Play.css';
import './Home.css';

const NAV_SECTIONS = [
  { id: 'work', label: 'work', type: 'scroll', target: 'work' },
  { id: 'play', label: 'play', type: 'route', path: '/play' },
  { id: 'about', label: 'about', type: 'scroll', target: 'about' },
];

function buildMixedStream() {
  const stream = [];
  let workIdx = 0;
  let playIdx = 0;
  let pair = 0;

  while (workIdx < WORK_PROJECTS.length || playIdx < PLAY_PROJECTS.length) {
    for (let i = 0; i < 2 && workIdx < WORK_PROJECTS.length; i += 1) {
      const float =
        workIdx % 4 === 0
          ? 'float-up'
          : workIdx % 4 === 1
            ? 'float-down'
            : workIdx % 4 === 2
              ? 'float-mid-up'
              : 'float-mid-down';
      stream.push({
        kind: 'work',
        key: WORK_PROJECTS[workIdx].id,
        project: WORK_PROJECTS[workIdx],
        anchor: workIdx === 0 ? 'work' : undefined,
        float,
      });
      workIdx += 1;
    }
    for (let i = 0; i < 2 && playIdx < PLAY_PROJECTS.length; i += 1) {
      stream.push({
        kind: 'play',
        key: PLAY_PROJECTS[playIdx].id,
        project: PLAY_PROJECTS[playIdx],
        float: i === 0 ? 'float-play-high' : 'float-play-low',
      });
      playIdx += 1;
    }
    pair += 1;
    if (pair > 20) break;
  }
  return stream;
}

const MIXED_STREAM = buildMixedStream();

const Home = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const [protectedPath, setProtectedPath] = useState(null);
  const [activePlay, setActivePlay] = useState(null);
  const [scrollEdge, setScrollEdge] = useState('start'); // start | middle | end

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    let rafId = 0;
    let pendingDelta = 0;

    const flush = () => {
      rafId = 0;
      if (pendingDelta === 0) return;
      const next = scroller.scrollLeft + pendingDelta;
      pendingDelta = 0;
      scroller.scrollLeft = next;
    };

    const queueHorizontal = (delta) => {
      if (!delta) return;
      pendingDelta += delta;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const onWheel = (e) => {
      if (
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }

      let delta = e.deltaY + e.deltaX;
      if (delta === 0) return;

      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerWidth;

      e.preventDefault();
      queueHorizontal(delta);
    };

    const onKeyDown = (e) => {
      if (
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }

      const page = Math.max(240, Math.floor(window.innerWidth * 0.55));
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        queueHorizontal(page);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        queueHorizontal(-page);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scroller.scrollLeft = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scroller.scrollLeft = scroller.scrollWidth;
      }
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      scroller.removeEventListener('wheel', onWheel);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKeyDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateEdge = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const left = scroller.scrollLeft;
      const edge = Math.min(window.innerWidth * 0.45, max * 0.35);
      if (left < edge) setScrollEdge('start');
      else if (left > max - edge) setScrollEdge('end');
      else setScrollEdge('middle');
    };

    updateEdge();
    scroller.addEventListener('scroll', updateEdge, { passive: true });
    window.addEventListener('resize', updateEdge);
    return () => {
      scroller.removeEventListener('scroll', updateEdge);
      window.removeEventListener('resize', updateEdge);
    };
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      scrollerRef.current?.scrollTo({ left: 0 });
      return;
    }
    requestAnimationFrame(() => scrollHomeTo(hash));
  }, [location.hash]);

  const handleProtectedClick = (path) => {
    setProtectedPath(path);
  };

  const handlePasswordSuccess = () => {
    const path = protectedPath;
    setProtectedPath(null);
    if (path) navigate(path);
  };

  const goHome = () => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: 0, behavior: 'smooth' });
    if (window.history.replaceState) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleNav = (item) => {
    if (item.type === 'route') {
      navigate(item.path);
      return;
    }
    scrollHomeTo(item.target);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `/#${item.target}`);
    }
  };

  return (
    <div className="home home--horizontal">
      <nav className="home-section-nav" aria-label="Sections">
        {NAV_SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="home-section-btn"
            onClick={() => handleNav(item)}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {item.label}
          </button>
        ))}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="home-section-btn home-section-btn--resume"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          resume
          <span className="home-section-btn-arrow" aria-hidden>↗</span>
        </a>
      </nav>

      <div className="home-contact-links" aria-label="Contact links">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="home-contact-link"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {link.label}
            <span className="home-contact-link-arrow" aria-hidden>↗</span>
          </a>
        ))}
      </div>

      <div
        className={`home-hero-chrome${scrollEdge === 'middle' ? ' home-hero-chrome--hidden' : ''}`}
      >
        {scrollEdge === 'end' ? (
          <button
            type="button"
            className="home-scroll-hint home-scroll-hint--action"
            onClick={goHome}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            click to go back to home
          </button>
        ) : (
          <p className="home-scroll-hint" aria-hidden="true">
            scroll to side
          </p>
        )}
      </div>

      <ScrollRuler scrollerRef={scrollerRef} setCursorVariant={setCursorVariant} />

      <div className="home-scroller" id="home-scroller" ref={scrollerRef}>
        <section className="home-slide home-slide-hero" id="home">
          <Hero setCursorVariant={setCursorVariant} />
        </section>

        {MIXED_STREAM.map((item, index) => (
          <section
            key={item.key}
            className={`home-slide home-slide-card home-slide-${item.kind} ${item.float || ''}`}
            id={item.anchor}
          >
            {item.kind === 'work' ? (
              <ProjectCard
                project={item.project}
                index={index}
                setCursorVariant={setCursorVariant}
                onProtectedClick={handleProtectedClick}
              />
            ) : (
              <PlayCard
                project={item.project}
                index={index}
                setCursorVariant={setCursorVariant}
                onOpen={setActivePlay}
              />
            )}
          </section>
        ))}

        <section className="home-slide home-slide-about" id="about">
          <div className="about-page about-page--slide">
            <div className="about-page-cards">
              <div className="about-bio-column">
                <h2 className="about-hi">Hello, I&apos;m Karen.</h2>
                <div className="about-bio-section">
                  <div className="about-bio-layout">
                    <div className="about-photo-wrap" aria-hidden="true">
                      <img
                        src="/about-photo.png"
                        alt=""
                        className="about-photo"
                        loading="eager"
                      />
                    </div>
                    <div className="about-bio-content">
                      <p className="about-bio">
                        I&apos;ve always loved creating, starting in high school with choreographing dances to designing buildings for my architecture degree. When I discovered product design, I fell in love with its iterative nature and human impact. Today, I design Kroger&apos;s ecommerce interface, to help 11 million shoppers buy groceries online easier daily. When I&apos;m not designing, I&apos;m climbing! Check out{' '}
                        <a
                          href="https://www.instagram.com/karebiner"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about-bio-link"
                          onMouseEnter={() => setCursorVariant?.('hover')}
                          onMouseLeave={() => setCursorVariant?.('default')}
                        >
                          @karebiner
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-details-card">
                <section className="about-experience-section">
                  <h2 className="about-section-label">EXPERIENCE</h2>
                  <div className="about-experience-list">
                    <div className="about-experience-item">
                      <div className="about-experience-role">Product Design</div>
                      <div className="about-experience-company">Kroger</div>
                      <div className="about-experience-date">2024 – now</div>
                    </div>
                    <div className="about-experience-item">
                      <div className="about-experience-role">Product Design</div>
                      <div className="about-experience-company">Dick&apos;s Sporting Goods</div>
                      <div className="about-experience-date">2023</div>
                    </div>
                  </div>
                </section>

                <section className="about-education-section">
                  <h2 className="about-section-label">EDUCATION</h2>
                  <div className="about-education-list">
                    <div className="about-education-item">
                      <div className="about-education-degree">M.S. Engineering Design Innovation</div>
                      <div className="about-education-school">Northwestern University</div>
                      <div className="about-education-date">2023 – 2025</div>
                    </div>
                    <div className="about-education-item">
                      <div className="about-education-degree">B.S. Architecture</div>
                      <div className="about-education-school">Georgia Institute of Technology</div>
                      <div className="about-education-date">2018 – 2023</div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        </section>
      </div>

      <PasswordGate
        password="karenkodera"
        isOpen={Boolean(protectedPath)}
        onClose={() => setProtectedPath(null)}
        onSuccess={handlePasswordSuccess}
      />

      <AnimatePresence>
        {activePlay && (
          <PlayModal
            project={activePlay}
            onClose={() => setActivePlay(null)}
            setCursorVariant={setCursorVariant}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export function AboutRedirect() {
  return <Navigate to="/#about" replace />;
}

export default Home;
