import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import './PlaySwipeCarousel.css';

const isVideoSrc = (src) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(src || '');

/**
 * Skiper48-style card swipe stack for play projects,
 * with Skiper47-style pagination dots underneath.
 *
 * Cards + loop is buggy with few slides, so we rewind at the ends.
 * Card content is a div (not a <button>) so pointer drags aren't stolen.
 */
const PlaySwipeCarousel = ({ projects, onOpen, setCursorVariant }) => {
  const draggedRef = useRef(false);

  return (
    <div className="play-swipe">
      <p className="play-swipe-note">
        I love to design in my free time too. Click and drag to flip through my
        fun projects.
      </p>

      <Swiper
        className="play-swipe-swiper"
        modules={[EffectCards, Pagination]}
        effect="cards"
        grabCursor
        rewind
        nested={false}
        simulateTouch
        allowTouchMove
        touchStartPreventDefault={false}
        threshold={0}
        shortSwipes
        longSwipesRatio={0.12}
        longSwipesMs={180}
        followFinger
        resistanceRatio={0.35}
        speed={380}
        cardsEffect={{
          slideShadows: true,
          rotate: true,
          perSlideRotate: 2,
          perSlideOffset: 8,
        }}
        pagination={{
          el: '.play-swipe-dots',
          clickable: true,
          bulletClass: 'play-swipe-dot',
          bulletActiveClass: 'play-swipe-dot--active',
        }}
        onTouchStart={() => {
          draggedRef.current = false;
        }}
        onSliderMove={() => {
          draggedRef.current = true;
        }}
        onClick={(s) => {
          if (draggedRef.current || !s.allowClick) return;
          const project = projects[s.realIndex];
          if (project) onOpen?.(project);
        }}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="play-swipe-slide">
            <div
              className="play-swipe-card"
              role="button"
              tabIndex={0}
              aria-label={`${project.title}. ${project.subtitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen?.(project);
                }
              }}
              onMouseEnter={() => setCursorVariant?.('hover')}
              onMouseLeave={() => setCursorVariant?.('default')}
            >
              {project.coverVideo || isVideoSrc(project.cover) ? (
                <video
                  src={project.cover}
                  className={[
                    'play-swipe-media',
                    project.coverZoom ? 'play-swipe-media--zoom' : '',
                    project.coverFocus ? `play-swipe-media--focus-${project.coverFocus}` : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  draggable={false}
                />
              ) : (
                <img
                  src={project.cover}
                  alt=""
                  className={[
                    'play-swipe-media',
                    project.coverZoom ? 'play-swipe-media--zoom' : '',
                    project.coverFocus ? `play-swipe-media--focus-${project.coverFocus}` : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  draggable={false}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="play-swipe-dots"
        role="tablist"
        aria-label="Play projects"
      />
    </div>
  );
};

export default PlaySwipeCarousel;
