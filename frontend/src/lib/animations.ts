import type { Variants, Transition } from 'framer-motion';

// ============================================
// ANIMATION VARIANTS
// ============================================

/**
 * Fade in/out animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide up with fade animation
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Slide down with fade animation
 */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Scale in with fade animation
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Scale up animation (for modals)
 */
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

/**
 * Slide in from right (for toasts, sidebars)
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

// ============================================
// CONTAINER VARIANTS (for staggered children)
// ============================================

/**
 * Container that staggers children animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Fast stagger for list items
 */
export const fastStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// ============================================
// ITEM VARIANTS (for use with containers)
// ============================================

/**
 * Item variant for staggered lists
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * Card item with scale effect
 */
export const cardItem: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// ============================================
// HOVER ANIMATIONS
// ============================================

/**
 * Button hover/tap animation props
 */
export const buttonAnimation = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 } as Transition,
};

/**
 * Card hover animation props
 */
export const cardHoverAnimation = {
  whileHover: { scale: 1.02, y: -4 },
  transition: { duration: 0.2 } as Transition,
};

/**
 * Subtle card hover (for lists)
 */
export const subtleCardHover = {
  whileHover: { y: -4 },
  transition: { duration: 0.2 } as Transition,
};

/**
 * Icon hover animation
 */
export const iconHover = {
  whileHover: { scale: 1.1, rotate: 5 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 } as Transition,
};

// ============================================
// LOADING ANIMATIONS
// ============================================

/**
 * Spinner rotation animation
 */
export const spinAnimation = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  } as Transition,
};

/**
 * Shimmer animation for skeletons
 */
export const shimmerAnimation = {
  animate: { x: ['−100%', '100%'] },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  } as Transition,
};

/**
 * Pulse animation
 */
export const pulseAnimation = {
  animate: { scale: [1, 1.05, 1] },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  } as Transition,
};

// ============================================
// PAGE TRANSITIONS
// ============================================

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Page transition timing
 */
export const pageTransitionConfig: Transition = {
  duration: 0.3,
  ease: 'easeInOut',
};

// ============================================
// BACKGROUND ANIMATIONS
// ============================================

/**
 * Floating blob animation (for auth pages)
 */
export const floatingBlob = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 90, 0],
    x: [0, 30, 0],
    y: [0, -30, 0],
  },
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'easeInOut',
  } as Transition,
};

/**
 * Second floating blob (offset timing)
 */
export const floatingBlobAlt = {
  animate: {
    scale: [1.2, 1, 1.2],
    rotate: [0, -90, 0],
    x: [0, -20, 0],
    y: [0, 20, 0],
  },
  transition: {
    duration: 25,
    repeat: Infinity,
    ease: 'easeInOut',
  } as Transition,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation props respecting reduced motion preference
 */
export const getMotionProps = <T extends object>(props: T): T | object => {
  if (prefersReducedMotion()) {
    return {};
  }
  return props;
};

/**
 * Create stagger delay based on index
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05): number => {
  return index * baseDelay;
};
