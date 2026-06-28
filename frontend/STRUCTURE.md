# Frontend Project Structure

This document explains the industry-standard folder structure used in the BMM Website frontend.

## 📁 Directory Overview

```
frontend/
├── app/                          # Next.js App Router (pages and routes)
│   ├── (marketing)/             # Route group for marketing pages
│   │   ├── page.tsx            # Home page (/)
│   │   └── initiatives/
│   │       └── page.tsx        # Initiatives page (/initiatives)
│   ├── layout.tsx              # Root layout with Navbar and Footer
│   └── globals.css             # Global styles
│
├── src/
│   ├── components/
│   │   ├── features/           # Feature-specific components
│   │   │   └── home/          # Home page sections
│   │   │       ├── HeroSection.tsx
│   │   │       ├── QuickLinks.tsx
│   │   │       ├── ImageSlider.tsx
│   │   │       ├── SponsorsSection.tsx
│   │   │       ├── CommitteeMembers.tsx
│   │   │       └── NewsletterCard.tsx
│   │   │
│   │   ├── layout/             # Layout components (shared across pages)
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── ui/                 # Reusable UI components (design system)
│   │       ├── Button.tsx
│   │       └── Container.tsx
│   │
│   ├── constants/              # App constants and configuration
│   │   └── navigation.ts
│   │
│   ├── data/                   # Static data files (JSON)
│   │   ├── initiatives.json
│   │   ├── slider-images.json
│   │   └── committee-members.json
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts
│   │
│   ├── lib/                    # Utility functions and helpers
│   │   └── utils.ts
│   │
│   ├── services/               # API service layer
│   │   └── api.ts
│   │
│   └── types/                  # TypeScript type definitions
│       └── index.ts
```

## 🎯 Key Principles

### 1. **Route Groups** `(marketing)`
- Used to organize related pages without affecting URL structure
- `/app/(marketing)/page.tsx` → URL: `/`
- `/app/(marketing)/initiatives/page.tsx` → URL: `/initiatives`
- Makes it easy to add more route groups like `(dashboard)`, `(auth)`, etc.

### 2. **Feature-Based Organization**
- Components are grouped by **feature** (home, about, events, etc.)
- Each feature folder contains all components specific to that page/feature
- Makes it easy to find and maintain related components
- Scales well as the app grows

### 3. **Component Categories**

#### `features/` - Page-Specific Components
- Components that are only used on specific pages
- Example: `HeroSection` is only used on the home page
- Organized by feature: `features/home/`, `features/about/`, etc.

#### `layout/` - Shared Layout Components
- Components that appear on every page
- Examples: `Navbar`, `Footer`, `Sidebar`
- Imported in `app/layout.tsx`

#### `ui/` - Reusable Design System Components
- Generic, reusable UI components
- Examples: `Button`, `Card`, `Input`, `Container`
- Follow design system patterns (like shadcn/ui)
- Can be used anywhere in the app

### 4. **Separation of Concerns**

- **`constants/`** - Configuration and static data
- **`data/`** - JSON data files (could be moved to CMS later)
- **`hooks/`** - Custom React hooks for reusable logic
- **`lib/`** - Utility functions (e.g., `cn()` for className merging)
- **`services/`** - API calls and external service integrations
- **`types/`** - TypeScript interfaces and types

## 🔄 Migration Notes

### Old Structure (Deprecated)
The following locations have been deprecated and will be removed:

- `src/components/sections/*` → Moved to `src/components/features/home/`
- `src/components/pages/InitiativesPage.tsx` → Moved to `app/(marketing)/initiatives/page.tsx`
- `app/page.tsx` → Moved to `app/(marketing)/page.tsx`

### Import Path Updates
All imports have been updated to use the new paths. Example:

```typescript
// Old
import { HeroSection } from "@/src/components/sections/HeroSection";

// New
import { HeroSection } from "@/src/components/features/home/HeroSection";
```

## 📈 Future Growth

As the app grows, you can add:

```
app/
├── (marketing)/           # Marketing pages (home, about, initiatives)
├── (dashboard)/           # User dashboard pages
├── (auth)/               # Authentication pages (login, register)
└── api/                  # API routes (if needed)

src/components/
├── features/
│   ├── home/            # Home page components
│   ├── about/           # About page components
│   ├── events/          # Events page components
│   └── dashboard/       # Dashboard components
```

## 🎨 Component Usage Examples

### Using a Feature Component
```typescript
// In app/(marketing)/page.tsx
import { HeroSection } from "@/src/components/features/home/HeroSection";

export default function Home() {
  return <HeroSection />;
}
```

### Using a UI Component
```typescript
// In any component
import { Button } from "@/src/components/ui/Button";

<Button variant="secondary" size="lg">Click me</Button>
```

### Using a Layout Component
```typescript
// In app/layout.tsx
import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## ✅ Benefits of This Structure

1. **Scalability** - Easy to add new features and pages
2. **Maintainability** - Related components are grouped together
3. **Discoverability** - Clear folder names make it easy to find components
4. **Industry Standard** - Follows Next.js and React best practices
5. **Team Collaboration** - Multiple developers can work on different features without conflicts
6. **Code Reusability** - UI components can be reused across features

---

**Last Updated:** June 28, 2026  
**Restructured by:** Jarvis (AI Assistant)
