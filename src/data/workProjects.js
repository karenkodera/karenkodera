export const WORK_PROJECTS = [
  {
    id: 'work-hsafsa',
    title: 'Unlocking HSA/FSA capabilities in Grocery Checkout',
    subtitle: 'Kroger Product Design',
    image: '/hsafsa/cover.png',
    link: '/hsa-fsa',
    tags: ['Shipped', '2026'],
    year: '2026',
  },
  {
    id: 'work-kroger-ad',
    title: 'A Kroger Ad',
    subtitle: 'Kroger Product Design',
    image: '/kroger/ad-coming-soon.svg',
    comingSoon: true,
    tags: ['Coming soon'],
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
    id: 'work-dsg',
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods Product Design Internship",
    image: 'https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg',
    link: '/dsg',
    tags: ['Handed off', '2023'],
    year: '2023',
  },
];

export const WORK_PROJECT_PATHS = WORK_PROJECTS.map((p) => p.link).filter(Boolean);
