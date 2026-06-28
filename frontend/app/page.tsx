import { HeroSection } from "@/src/components/sections/HeroSection";
import { QuickLinks } from "@/src/components/sections/QuickLinks";
import { ImageSlider } from "@/src/components/sections/ImageSlider";
import { SponsorsSection } from "@/src/components/sections/SponsorsSection";
import { CommitteeMembers } from "@/src/components/sections/CommitteeMembers";
import { NewsletterCard } from "@/src/components/sections/NewsletterCard";

export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickLinks />
      <SponsorsSection />
       <ImageSlider />
      <CommitteeMembers />
      <NewsletterCard />
    </>
  );
}