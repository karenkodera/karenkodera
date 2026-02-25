/**
 * Case study metadata for nav (prev/next) labels.
 * Paths must match route paths used in Link components.
 */
export const CASE_STUDIES_BY_PATH = {
  '/thesis': {
    title: 'Minimizing Overproduction in Fashion Retail',
    subtitle: "Northwestern Design Master's Thesis",
  },
  '/hsa-fsa': {
    title: 'Unlocking HSA/FSA capabilities in Grocery Checkout',
    subtitle: 'Kroger Product Design',
  },
  '/kroger': {
    title: 'Reducing Paper in Grocery Delivery',
    subtitle: 'Kroger Product Design Internship',
  },
  '/dsg': {
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods Product Design Internship",
  },
};

/**
 * Returns { title, subtitle } for a case study path, or null if not a case study.
 * @param {string} path - e.g. '/kroger', '/thesis'
 */
export function get_case_study_for_path(path) {
  const normalized = path?.replace(/#.*$/, '') || '';
  return CASE_STUDIES_BY_PATH[normalized] ?? null;
}
