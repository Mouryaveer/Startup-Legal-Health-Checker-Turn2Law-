// ============================================================
// Turn2Law Legal Health Check — Animation Variants
// Framer Motion reusable animation presets
// ============================================================

import type { Variants, Transition } from "framer-motion";

// ── Transition Presets ──
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const elasticTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 15,
  mass: 0.8,
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const gentleTransition: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
};

// ── Fade Variants ──
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smoothTransition },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleTransition,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: gentleTransition,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: gentleTransition,
  },
};

// ── Scale Variants ──
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: elasticTransition,
  },
};

// ── Stagger Container ──
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleTransition,
  },
};

// ── Slide Variants ──
export const slideInFromRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...gentleTransition, duration: 0.5 },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { ...gentleTransition, duration: 0.4 },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { ...gentleTransition, duration: 0.5 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { ...gentleTransition, duration: 0.4 },
  },
};

// ── Hover Effects ──
export const hoverScale = {
  scale: 1.03,
  transition: springTransition,
};

export const hoverLift = {
  y: -4,
  transition: springTransition,
};

export const tapScale = {
  scale: 0.97,
};

// ── Card Hover ──
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 12px rgba(10, 10, 10, 0.06)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 60px rgba(10, 10, 10, 0.1)",
    transition: springTransition,
  },
};

// ── Progress / Gauge Animation ──
export const drawCircle: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.3 },
    },
  },
};

// ── Count Up Variant ──
export function createCountAnimation(
  from: number,
  to: number,
  duration: number = 2
) {
  return {
    initial: { value: from },
    animate: {
      value: to,
      transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };
}

// ── Page Transition ──
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
    },
  },
};

// ── Floating Animation ──
export const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const floatingSlow = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ── Pulse Glow ──
export const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(216, 160, 76, 0)",
      "0 0 0 8px rgba(216, 160, 76, 0.15)",
      "0 0 0 0 rgba(216, 160, 76, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
