import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IntroSplash from '../components/IntroSplash';
import ProjectCard from '../components/ProjectCard';
import StickerNote from '../components/StickerNote';
import { WORK_PROJECTS } from '../data/workProjects';
import './About.css';
import './Home.css';

/** Survives SPA remounts; resets on full page load so the intro plays again. */
let introSeenThisLoad = false;

const About = ({ setCursorVariant }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [introDone, setIntroDone] = useState(() => introSeenThisLoad);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const handleIntroComplete = useCallback(() => {
    introSeenThisLoad = true;
    setIntroDone(true);
  }, []);

  useEffect(() => {
    if (introDone) {
      setCursorVariant?.('default');
      document.documentElement.removeAttribute('data-intro');
      return undefined;
    }
    setCursorVariant?.('intro');
    document.documentElement.setAttribute('data-intro', '1');
    return () => {
      setCursorVariant?.('default');
      document.documentElement.removeAttribute('data-intro');
    };
  }, [introDone, setCursorVariant]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

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

      const page = Math.max(240, Math.floor(window.innerHeight * 0.55));
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        if (scroller.scrollTop < max - 2) {
          e.preventDefault();
          scroller.scrollTop = Math.min(max, scroller.scrollTop + page);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (scroller.scrollTop > 2) {
          e.preventDefault();
          scroller.scrollTop = Math.max(0, scroller.scrollTop - page);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scroller.scrollTop = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scroller.scrollTop = scroller.scrollHeight;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateHint = () => {
      const edge = Math.min(window.innerHeight * 0.4, 220);
      setShowScrollHint(scroller.scrollTop < edge);
    };

    updateHint();
    scroller.addEventListener('scroll', updateHint, { passive: true });
    window.addEventListener('resize', updateHint);
    return () => {
      scroller.removeEventListener('scroll', updateHint);
      window.removeEventListener('resize', updateHint);
    };
  }, []);

  // Scroll to about/work anchors; legacy hashes
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const hash = location.hash.replace('#', '');
    const scrollTo = location.state?.scrollTo || hash;

    if (scrollTo === 'play') {
      navigate('/play', { replace: true });
      return;
    }

    const go = (id) => {
      if (id === 'work') {
        const work = document.getElementById('work');
        if (work) {
          scroller.scrollTo({ top: work.offsetTop, behavior: 'smooth' });
          return;
        }
      }
      scroller.scrollTo({ top: 0, behavior: scrollTo ? 'smooth' : 'auto' });
    };

    if (scrollTo === 'work' || scrollTo === 'about' || hash === 'work' || hash === 'about') {
      requestAnimationFrame(() => go(scrollTo === 'work' || hash === 'work' ? 'work' : 'about'));
      if (hash && window.history.replaceState) {
        window.history.replaceState(null, '', '/');
      }
      return;
    }

    if (!location.state?.scrollTo) {
      scroller.scrollTo({ top: 0 });
    }
  }, [location.hash, location.state, navigate]);

  return (
    <div className={`home home--vertical${introDone ? '' : ' home--intro'}`}>
      {!introDone && <IntroSplash onComplete={handleIntroComplete} />}

      <div className="home-scroller" id="home-scroller" ref={scrollerRef}>
        <section
          className={`about-route about-route--in-scroller${introDone ? '' : ' about-route--intro'}`}
          id="about"
        >
          <div className="about-page about-page--slide">
            <div className="about-page-cards">
              <div className="about-bio-column">
                <h2 className="about-hi">Hello, I&apos;m Karen.</h2>
                <div className="about-bio-stack">
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
                        I&apos;ve always loved creating, starting in high school with choreographing
                        dances to designing buildings for my architecture degree. When I discovered
                        product design, I fell in love with its iterative nature and human impact.
                        Today, I design Kroger&apos;s ecommerce interface, to help 11 million shoppers
                        buy groceries online daily. When I&apos;m not designing, I&apos;m climbing!
                      </p>
                    </div>
                  </div>

                  <div className="about-stickers-box">
                    <StickerNote setCursorVariant={setCursorVariant} />
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
                      <div className="about-education-degree">
                        M.S. Engineering Design Innovation
                      </div>
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

          {introDone && showScrollHint && (
            <p className="about-scroll-hint" aria-hidden="true">
              <span className="about-scroll-hint-label">scroll down</span>
              <span className="about-scroll-hint-arrow" aria-hidden>
                ↓
              </span>
            </p>
          )}
        </section>

        <section className="home-work-section" id="work">
          <div className="home-work-grid">
            {WORK_PROJECTS.map((project, index) => (
              <div key={project.id} className="home-work-cell">
                <ProjectCard
                  project={project}
                  index={index}
                  setCursorVariant={setCursorVariant}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
