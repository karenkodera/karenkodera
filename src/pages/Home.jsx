import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import PasswordGate from '../components/PasswordGate';
import './Home.css';

const projects = [
  {
    id: 1,
    title: 'Unlocking HSA/FSA capabilities in Grocery Checkout',
    subtitle: 'Kroger Product Design',
    image: '/hsafsa/cover.png',
    link: '/hsa-fsa',
    requiresPassword: true,
    tags: ['Shipped', '2026'],
    year: '2026',
  },
  {
    id: 2,
    title: 'Minimizing Overproduction in Fashion Retail',
    subtitle: "Northwestern Design Master's Thesis",
    image: '/thesis/thesis-hero.png',
    link: '/thesis',
    tags: ['Concept', '2025'],
    year: '2025',
    workInProgress: true,
  },
  {
    id: 3,
    title: 'Reducing Paper in Grocery Delivery',
    subtitle: 'Kroger Product Design Internship',
    image: 'https://framerusercontent.com/images/Ke9J7fdcwS3xhhp9DwcHEG9cHk.jpg',
    link: '/kroger',
    tags: ['Handed off', '2024'],
    year: '2024',
  },
  {
    id: 4,
    title: 'Streamlining Audit Checks',
    subtitle: "Dick's Sporting Goods Product Design Internship",
    image: 'https://framerusercontent.com/images/tQwaUHTuNBtjPuTDXDbT0SsxXf8.jpg',
    link: '/dsg',
    tags: ['Handed off', '2023'],
    year: '2023',
  },
];

const Home = ({ setCursorVariant, handleCursorChange, theme, setTheme }) => {
  const navigate = useNavigate();
  const [protectedPath, setProtectedPath] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProtectedClick = (path) => {
    setProtectedPath(path);
  };

  const handlePasswordSuccess = () => {
    const path = protectedPath;
    setProtectedPath(null);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="home">
      <Hero setCursorVariant={setCursorVariant} />
      <SectionHeader setCursorVariant={setCursorVariant} />
      <section className="projects-section" id="work">
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              setCursorVariant={setCursorVariant}
              onProtectedClick={handleProtectedClick}
            />
          ))}
        </div>
      </section>
      <PasswordGate
        password="karenkodera"
        isOpen={Boolean(protectedPath)}
        onClose={() => setProtectedPath(null)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Home;
