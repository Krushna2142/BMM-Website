'use client';
// frontend/app/page.tsx

import { HeroSection } from '@/src/components/features/home/HeroSection';
import { ActionButtonSection } from '@/src/components/features/home/ActionButtonSection';
import { SponsorsSection } from '@/src/components/features/home/SponsorsSection';
import { ImageSlider } from '@/src/components/features/home/ImageSlider';
import { CommitteeMembers } from '@/src/components/features/home/CommitteeMembers';
import { NewsletterCard } from '@/src/components/features/home/NewsletterCard';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ActionButtonSection />
      <SponsorsSection />
      <ImageSlider />
      <CommitteeMembers />
      <NewsletterCard />
    </>
  );
}