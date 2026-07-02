// frontend/app/(marketing)/layout.tsx
// import Navbar from "@/components/marketing/Navbar";
// import Footer from "@/components/marketing/Footer";

import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}