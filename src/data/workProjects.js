export const WORK_PROJECTS = [
  {
    id: 'work-hsafsa',
    name: 'Kroger',
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
    name: 'Bridg',
    title: 'Minimizing Overproduction in Fashion Retail',
    subtitle: "Northwestern Design Master's Thesis",
    image: '/case%20bridg/cover.png',
    link: '/thesis',
    tags: ['Concept', '2025'],
    year: '2025',
  },
  {
    id: 'work-kroger',
    name: 'Kroger',
    title: 'Reducing Paper in Grocery Delivery',
    subtitle: 'Kroger Product Design Internship',
    image: 'https://framerusercontent.com/images/Ke9J7fdcwS3xhhp9DwcHEG9cHk.jpg',
    link: '/kroger',
    tags: ['Handed off', '2024'],
    year: '2024',
  },
  {
    id: 'work-dsg',
    name: "DICK's Sporting Goods",
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods Product Design Internship",
    image: 'https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg',
    link: '/dsg',
    tags: ['Handed off', '2023'],
    year: '2023',
  },
];

export const WORK_PROJECT_PATHS = WORK_PROJECTS.map((p) => p.link);

export function getWorkProjectByPath(pathname) {
  return WORK_PROJECTS.find((p) => p.link === pathname) ?? null;
}

export function workTitleLayoutId(projectId) {
  return `work-title-${projectId}`;
}
