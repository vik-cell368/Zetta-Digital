import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(20px)', y: -20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
