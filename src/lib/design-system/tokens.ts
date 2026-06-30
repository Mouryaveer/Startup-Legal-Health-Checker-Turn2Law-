// ============================================================
// Turn2Law Legal Health Check — Design Tokens
// ============================================================

export const brand = {
  // Primary palette
  gold: {
    DEFAULT: "#D8A04C",
    50: "#FDF8EF",
    100: "#F9EDDA",
    200: "#F2D6A2",
    300: "#E8BD6E",
    400: "#D8A04C",
    500: "#C4892F",
    600: "#A86E22",
    700: "#8E5F28",
    800: "#6E4A22",
    900: "#4A3118",
  },
  // Neutrals
  black: "#0A0A0A",
  white: "#FFFFFF",
  warmWhite: "#FEFCF9",
  offWhite: "#FAF8F5",
  cream: "#F5F1EB",

  // Text
  text: {
    primary: "#0A0A0A",
    secondary: "#3D3D3D",
    muted: "#6B6B6B",
    subtle: "#9B9B9B",
    disabled: "#BFBFBF",
  },

  // Borders
  border: {
    DEFAULT: "#E8E1D5",
    light: "#F0EBE3",
    dark: "#C9BFA9",
    gold: "#D8A04C",
  },

  // Status
  status: {
    critical: "#DC2626",
    high: "#EA580C",
    medium: "#D97706",
    low: "#65A30D",
    healthy: "#16A34A",
  },

  // Shadows
  shadow: {
    sm: "0 1px 2px rgba(10, 10, 10, 0.04)",
    md: "0 4px 12px rgba(10, 10, 10, 0.06)",
    lg: "0 8px 30px rgba(10, 10, 10, 0.08)",
    xl: "0 20px 60px rgba(10, 10, 10, 0.1)",
    gold: "0 4px 20px rgba(216, 160, 76, 0.15)",
    goldLg: "0 8px 40px rgba(216, 160, 76, 0.2)",
  },

  // Gradients
  gradient: {
    gold: "linear-gradient(135deg, #D8A04C, #F2D6A2, #8E5F28)",
    goldSubtle: "linear-gradient(135deg, #D8A04C, #E8BD6E)",
    goldLight: "linear-gradient(135deg, rgba(216, 160, 76, 0.08), rgba(242, 214, 162, 0.04))",
    warmBg: "linear-gradient(180deg, #FEFCF9, #FFFFFF)",
    heroRadial: "radial-gradient(ellipse at 50% 30%, rgba(216, 160, 76, 0.06) 0%, transparent 60%)",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1.1" }],
    "6xl": ["3.75rem", { lineHeight: "1.05" }],
    "7xl": ["4.5rem", { lineHeight: "1" }],
  },
} as const;

export const spacing = {
  section: {
    sm: "3rem",
    md: "5rem",
    lg: "7rem",
    xl: "9rem",
  },
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },
} as const;

export const borderRadius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;
