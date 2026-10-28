import { useEffect, useState } from 'react';

const DEFAULT_OFFSET = 160;

function getCaseStudyScroller() {
  return document.querySelector('.page-transition--scroll');
}

/**
 * Scroll-spy for case-study side nav.
 * Listens to the page shell scroller (not window) — case studies scroll
 * inside `.page-transition--scroll` after the route transition fix.
 */
export function useCaseStudyScrollSpy(sectionIds, topOffset = DEFAULT_OFFSET) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? null);
  const idsKey = sectionIds.join('|');

  useEffect(() => {
    const ids = idsKey.split('|').filter(Boolean);
    if (!ids.length) return undefined;

    const updateActiveSection = () => {
      const trigger = topOffset;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= trigger && bottom >= trigger) {
          setActiveSectionId(id);
          return;
        }
      }
      for (let i = ids.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= trigger) {
          setActiveSectionId(ids[i]);
          return;
        }
      }
      setActiveSectionId(ids[0]);
    };

    const scroller = getCaseStudyScroller();
    // Reset scroll position when the case study mounts
    if (scroller) scroller.scrollTop = 0;
    else window.scrollTo(0, 0);

    updateActiveSection();
    // rAF once after layout settles (images/fonts)
    const raf = requestAnimationFrame(updateActiveSection);

    scroller?.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [idsKey, topOffset]);

  const scrollToSection = (id) => {
    const scroller = getCaseStudyScroller();
    // HSA/FSA: first nav item is hero/context — scroll shell to top
    if (id === 'context') {
      if (scroller) {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { activeSectionId, scrollToSection };
}
