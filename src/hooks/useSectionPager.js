import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Work page (bio + projects) and play are separate — no scroll-between. */
export const SECTION_PATHS = ['/', '/play'];

/** Shared with App page transition — set before navigate so exit/enter match. */
export const pageDirRef = { current: 1 };

/** Kept for the side ruler; always 0 now that pages don't wheel-page. */
export const sectionTensionRef = { current: 0 };

export function sectionIndex(pathname) {
  return SECTION_PATHS.indexOf(pathname);
}

/** Direction for nav transitions: 1 = forward (down), -1 = back (up). */
export function sectionDirection(fromPath, toPath) {
  const from = sectionIndex(fromPath);
  const to = sectionIndex(toPath);
  if (from < 0 || to < 0 || from === to) return 1;
  return to > from ? 1 : -1;
}

export function navigateSection(navigate, path, dir) {
  pageDirRef.current = dir;
  navigate(path, { state: { pageDir: dir } });
}

/**
 * Work and play are separate pages — no wheel/touch paging between them.
 * Nav pills still use navigateSection.
 */
export function useSectionPager() {
  const location = useLocation();

  useEffect(() => {
    sectionTensionRef.current = 0;
  }, [location.pathname]);
}
