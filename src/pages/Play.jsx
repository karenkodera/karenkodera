import { motion } from 'framer-motion';
import './Play.css';

const playItems = [
  {
    id: 1,
    title: 'Photography',
    description: 'Capturing moments through a creative lens',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
  },
  {
    id: 2,
    title: 'Travel',
    description: 'Exploring new places and cultures',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  },
  {
    id: 3,
    title: 'Art & Design',
    description: 'Personal creative explorations',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
  },
  {
    id: 4,
    title: 'Architecture',
    description: 'Finding beauty in built environments',
    image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800',
  },
];

const Play = ({ setCursorVariant }) => {
  const handleMouseEnter = () => setCursorVariant('project');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <div className="play-page">
      <motion.section
        className="play-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="play-title">Play</h1>
        <p className="play-description">
          Beyond work, I explore creativity through various personal projects and hobbies.
          Here's a glimpse into what inspires me outside of product design.
        </p>
      </motion.section>

      <section className="play-grid-section">
        <div className="play-grid">
          {playItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="play-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ y: -10 }}
            >
              <div className="play-card-image">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="play-card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Play;
