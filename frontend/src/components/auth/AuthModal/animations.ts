import { type Variants } from 'framer-motion';

export const backdropVariants: Variants = {
  visible: { opacity: 1, pointerEvents: 'auto', transition: { duration: 0.3 } },
  hidden: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.3 } },
};

export const modalContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const formVariants: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
};
