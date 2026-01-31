import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import './Home.css';

const projects = [
  {
    id: 1,
    title: 'Minimizing Overproduction in Fashion Retail',
    subtitle: "Northwestern Master's Thesis",
    image: 'https://framerusercontent.com/images/2TieXjM5ufkozZ2D7pZO9dXGvA.jpg',
    link: '/thesis',
    tags: ['Shipped', '2024'],
    year: '2024',
  },
  {
    id: 2,
    title: 'Reducing Paper in Grocery Delivery',
    subtitle: 'Kroger Internship',
    image: 'https://framerusercontent.com/images/Ke9J7fdcwS3xhhp9DwcHEG9cHk.jpg',
    link: null,
    tags: ['Handed Off', '2023'],
    year: '2023',
  },
  {
    id: 3,
    title: 'Package Pickup in Medical Centers',
    subtitle: 'Northwestern Medicine',
    image: 'https://framerusercontent.com/images/5rb8L0l175ZxQl8tMuL994H9UTU.jpg',
    link: '/nu-med',
    tags: ['Shipped', '2023'],
    year: '2023',
  },
  {
    id: 4,
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods",
    image: 'https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg',
    link: null,
    tags: ['Handed Off', '2023'],
    year: '2023',
  },
  {
    id: 5,
    title: 'YETI XP Experience Design',
    subtitle: 'Design Strategy for YETI',
    image: 'https://framerusercontent.com/images/uom1uci88lwYXNyNr9WUb7sFfs.jpg',
    link: '/yeti',
    tags: ['Shipped', '2022'],
    year: '2022',
  },
  {
    id: 6,
    title: 'Additional Case Study',
    subtitle: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800',
    link: null,
    tags: ['Handed Off', '2022'],
    year: '2022',
  },
];

const Home = ({ setCursorVariant, handleCursorChange }) => {
  return (
    <div className="home">
      <Hero setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />
      
      <section className="projects-section" id="work">
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              setCursorVariant={setCursorVariant}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
