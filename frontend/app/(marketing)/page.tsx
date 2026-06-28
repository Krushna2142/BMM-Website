import { HeroSection } from "@/src/components/features/home/HeroSection";
import { QuickLinks } from "@/src/components/features/home/QuickLinks";
import { ImageSlider } from "@/src/components/features/home/ImageSlider";
import { SponsorsSection } from "@/src/components/features/home/SponsorsSection";
import { CommitteeMembers } from "@/src/components/features/home/CommitteeMembers";
import { NewsletterCard } from "@/src/components/features/home/NewsletterCard";

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
