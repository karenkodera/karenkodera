import { useRef, useState } from 'react';
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
 */
const PlaySwipeCarousel = ({ projects, onOpen, setCursorVariant }) => {
  const draggedRef = useRef(false);
  const [swiper, setSwiper] = useState(null);

  return (
    <div className="play-swipe">
      <div className="play-swipe-stage">
        <button
          type="button"
          className="play-swipe-arrow play-swipe-arrow--prev"
          aria-label="Previous project"
          onClick={() => swiper?.slidePrev()}
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          ←
        </button>

        <Swiper
          className="play-swipe-swiper"
          modules={[EffectCards, Pagination]}
          effect="cards"
          grabCursor
          loop={projects.length > 2}
          centeredSlides
          spaceBetween={40}
          threshold={1}
          shortSwipes
          longSwipesRatio={0.15}
          longSwipesMs={200}
          followFinger
          resistanceRatio={0.45}
          speed={420}
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
          onSwiper={setSwiper}
          onTouchStart={() => {
            draggedRef.current = false;
          }}
          onSliderMove={() => {
            draggedRef.current = true;
          }}
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id} className="play-swipe-slide">
              <button
                type="button"
                className="play-swipe-card"
                aria-label={`${project.title}. ${project.subtitle}`}
                onClick={() => {
                  if (draggedRef.current) return;
                  onOpen?.(project);
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
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="play-swipe-arrow play-swipe-arrow--next"
          aria-label="Next project"
          onClick={() => swiper?.slideNext()}
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          →
        </button>
      </div>

      <div
        className="play-swipe-dots"
        role="tablist"
        aria-label="Play projects"
      />
    </div>
  );
};

export default PlaySwipeCarousel;
