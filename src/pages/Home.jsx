import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import PasswordGate from '../components/PasswordGate';
import { PLAY_PROJECTS, PlayModal, PlayCard } from './Play';
import { scrollHomeTo } from '../utils/scrollHome';
import './Home.css';
import './About.css';
import './Play.css';

const WORK_PROJECTS = [
  {
    id: 'work-hsafsa',
    title: 'Unlocking HSA/FSA capabilities in Grocery Checkout',
    subtitle: 'Kroger Product Design',
    image: '/hsafsa/cover.png',
    link: '/hsa-fsa',
    requiresPassword: true,
    tags: ['Shipped', '2026'],
    year: '2026',
  },
  {
    id: 'work-thesis',
    title: 'Minimizing Overproduction in Fashion Retail',
    subtitle: "Northwestern Design Master's Thesis",
    image: '/case%20bridg/cover.png',
    link: '/thesis',
    tags: ['Concept', '2025'],
    year: '2025',
  },
  {
    id: 'work-kroger',
    title: 'Reducing Paper in Grocery Delivery',
    subtitle: 'Kroger Product Design Internship',
    image: 'https://framerusercontent.com/images/Ke9J7fdcwS3xhhp9DwcHEG9cHk.jpg',
    link: '/kroger',
    tags: ['Handed off', '2024'],
    year: '2024',
  },
  {
    id: 'work-dsg',
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods Product Design Internship",
    image: 'https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg',
    link: '/dsg',
    tags: ['Handed off', '2023'],
    year: '2023',
  },
];

function buildMixedStream() {
  const stream = [];
  const max = Math.max(WORK_PROJECTS.length, PLAY_PROJECTS.length);
  for (let i = 0; i < max; i += 1) {
    if (WORK_PROJECTS[i]) {
      stream.push({
        kind: 'work',
        key: WORK_PROJECTS[i].id,
        project: WORK_PROJECTS[i],
        anchor: i === 0 ? 'work' : undefined,
      });
    }
    if (PLAY_PROJECTS[i]) {
      stream.push({
        kind: 'play',
        key: PLAY_PROJECTS[i].id,
        project: PLAY_PROJECTS[i],
        anchor: i === 0 ? 'play' : undefined,
      });
    }
  }
  return stream;
}

const RESUME_URL = 'https://drive.google.com/file/d/1hH56x_vKd1yI-vyyi-ExBk-bYQnbQq60/view?usp=sharing';

const MIXED_STREAM = buildMixedStream();

function TopLeftLinks({ setCursorVariant }) {
  const handleEnter = () => setCursorVariant?.('hover');
  const handleLeave = () => setCursorVariant?.('default');

  return (
    <div className="home-top-links" aria-label="Contact links">
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="home-top-link"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        LinkedIn
        <span className="home-top-link-arrow" aria-hidden>↗</span>
      </a>
      <a
        href="mailto:karen@kodera.us"
        className="home-top-link"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        Email
        <span className="home-top-link-arrow" aria-hidden>↗</span>
      </a>
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="home-top-link"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        Resume
        <span className="home-top-link-arrow" aria-hidden>↗</span>
      </a>
    </div>
  );
}

const Home = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const [protectedPath, setProtectedPath] = useState(null);
  const [activePlay, setActivePlay] = useState(null);
  const [onHeroSlide, setOnHeroSlide] = useState(true);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const onWheel = (e) => {
      // Don't steal scroll while a modal/gate is open
      if (
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }
      // Always map vertical wheel / trackpad scroll to horizontal on the home scroller
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      e.preventDefault();
      scroller.scrollLeft += delta;
    };

    // Capture on window so scrolling anywhere (even over fixed UI) moves sideways
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateHeroVisibility = () => {
      // Still on first slide while less than ~half a viewport past the start
      setOnHeroSlide(scroller.scrollLeft < window.innerWidth * 0.45);
    };

    updateHeroVisibility();
    scroller.addEventListener('scroll', updateHeroVisibility, { passive: true });
    window.addEventListener('resize', updateHeroVisibility);
    return () => {
      scroller.removeEventListener('scroll', updateHeroVisibility);
      window.removeEventListener('resize', updateHeroVisibility);
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

  return (
    <div className="home home--horizontal">
      <div className={`home-hero-chrome${onHeroSlide ? '' : ' home-hero-chrome--hidden'}`}>
        <TopLeftLinks setCursorVariant={setCursorVariant} />
        <p className="home-scroll-hint" aria-hidden="true">
          scroll to side →
        </p>
      </div>
      <div className="home-scroller" ref={scrollerRef}>
        <section className="home-slide home-slide-hero" id="home">
          <Hero setCursorVariant={setCursorVariant} />
        </section>

        {MIXED_STREAM.map((item, index) => (
          <section
            key={item.key}
            className={`home-slide home-slide-card home-slide-${item.kind}`}
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
                    I&apos;ve always loved creating, starting in high school with choreographing dances to designing buildings for my architecture degree. When I discovered product design, I fell in love with its iterative nature and human impact. Today, I design Kroger&apos;s ecommerce interface, to help 11 million shoppers buy groceries online easier daily.
                  </p>
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
                    <div className="about-experience-date">Jun 2024 – now</div>
                  </div>
                  <div className="about-experience-item">
                    <div className="about-experience-role">Product Design</div>
                    <div className="about-experience-company">Dick&apos;s Sporting Goods</div>
                    <div className="about-experience-date">Jun 2023 – Nov 2023</div>
                  </div>
                </div>
              </section>

              <section className="about-education-section">
                <h2 className="about-section-label">EDUCATION</h2>
                <div className="about-education-list">
                  <div className="about-education-item">
                    <div className="about-education-degree">M.S. Engineering Design Innovation</div>
                    <div className="about-education-school">Northwestern University</div>
                    <div className="about-education-date">Sept 2023 – Mar 2025</div>
                  </div>
                  <div className="about-education-item">
                    <div className="about-education-degree">B.S. Architecture</div>
                    <div className="about-education-school">Georgia Institute of Technology</div>
                    <div className="about-education-date">Aug 2018 – Aug 2023</div>
                  </div>
                </div>
              </section>
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

export function PlayRedirect() {
  return <Navigate to="/#play" replace />;
}

export function AboutRedirect() {
  return <Navigate to="/#about" replace />;
}

export default Home;
