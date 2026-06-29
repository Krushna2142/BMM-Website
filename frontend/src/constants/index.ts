export const NAVIGATION_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/initiatives", label: "BMM Initiatives" },  // Changed from /bmm-initiatives
  { href: "/bmm-members", label: "BMM Members" },
  { href: "/bmm-vrutta", label: "BMM Vrutta" },
  { href: "/committee", label: "Committee" },
  { href: "/contact", label: "Contact" },
];

export const QUICK_LINKS = [
  {
    id: 1,
    title: "BMM 2026 Seattle",
    href: "/events/2026-seattle",
    variant: "primary",
  },
  {
    id: 2,
    title: "🇮 Visiting India? BMM BVG offers!",
    href: "/offers/bvg",
    variant: "secondary",
  },
  {
    id: 3,
    title: "BMM 2026 Elections",
    href: "/elections/2026",
    variant: "primary",
  },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/bmm",
  twitter: "https://twitter.com/bmm",
  youtube: "https://youtube.com/bmm",
};

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  hero: {
    get: "/hero",
    update: "/hero",
  },
  media: {
    upload: "/media/upload",
  },
};