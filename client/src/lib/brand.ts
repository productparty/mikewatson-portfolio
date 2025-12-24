export const BRAND = {
  name: "Mike Watson",
  tagline: "Product & Delivery Expert",
  colors: {
    primary: { hsl: "160 32% 50%", hex: "#5ba78e" },
    background: { hsl: "45 20% 97%", hex: "#faf9f6" },
    foreground: { hsl: "0 0% 10%", hex: "#1a1a1a" },
    muted: { hsl: "0 0% 42%", hex: "#6b6b6b" },
    border: { hsl: "0 0% 90%", hex: "#e5e5e5" },
  },
  typography: {
    maxWidth: "1040px",
    lineHeight: { body: "1.7", heading: "1.2" },
  },
  spacing: {
    section: "clamp(4rem, 10vw, 8rem)",
    container: "clamp(1rem, 5vw, 2rem)",
  },
} as const;

