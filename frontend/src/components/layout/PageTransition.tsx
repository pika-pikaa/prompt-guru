import { type FC, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  pageTransition,
  pageTransitionConfig,
  prefersReducedMotion,
} from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  // Respect user's reduced motion preference
  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={pageTransitionConfig}
    >
      {children}
    </motion.div>
  );
};

PageTransition.displayName = 'PageTransition';
