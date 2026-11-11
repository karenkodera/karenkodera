import { useCallback, useEffect, useState } from 'react';
import IntroSplash from '../components/IntroSplash';
import StickerNote from '../components/StickerNote';
import './About.css';
import './Home.css';

/** Survives SPA remounts; resets on full page load so the intro plays again. */
let introSeenThisLoad = false;

const About = ({ setCursorVariant }) => {
  const [introDone, setIntroDone] = useState(() => introSeenThisLoad);

  const handleIntroComplete = useCallback(() => {
    introSeenThisLoad = true;
    setIntroDone(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className={`about-route${introDone ? '' : ' about-route--intro'}`} id="about">
      {!introDone && <IntroSplash onComplete={handleIntroComplete} />}

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
    </div>
  );
};

export default About;
