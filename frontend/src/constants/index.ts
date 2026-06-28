export const NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "BMM Initiatives", href: "/initiatives" },
  { label: "BMM Members", href: "/members" },
  { label: "BMM Vrutta", href: "/vrutta" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Committee", href: "/committee" },
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