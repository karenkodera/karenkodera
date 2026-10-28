import { motion } from 'framer-motion';
import { workTitleLayoutId } from '../data/workProjects';

const TITLE_TRANSITION = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.85,
};

/**
 * Shared Skiper80-style title: morphs from the work card into the case-study headline.
 */
const ProjectTitle = ({
  projectId,
  children,
  as = 'h3',
  className = '',
  layout = true,
}) => {
  const Component = motion[as] || motion.h3;

  return (
    <Component
      className={className}
      layoutId={layout ? workTitleLayoutId(projectId) : undefined}
      transition={TITLE_TRANSITION}
      style={{ transformOrigin: 'left center' }}
    >
      {children}
    </Component>
  );
};

export default ProjectTitle;
