// src/components/PageTransition.js
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween",
  duration: 0.5,
  ease: "easeInOut"
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  
  // Check if it's a pagination route change
  const isPaginationChange = (path) => {
    return path.startsWith('/page/');
  };

  // Only animate if it's not a pagination change
  const shouldAnimate = !isPaginationChange(location.pathname) || 
    (location.pathname === '/page/1' && !location.state?.fromPagination);
  
  if (!shouldAnimate) {
    return children;
  }

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;