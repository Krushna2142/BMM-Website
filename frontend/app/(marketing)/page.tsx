'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/src/components/marketing/HeroSection';
import ActionButtonsSection from '@/src/components/marketing/ActionButtonSection';
import SponsorsSection from '@/src/components/marketing/SponsorsSection';
import ImageSliderSection from '@/src/components/marketing/ImageSliderSection';
import CommitteeSection from '@/src/components/marketing/CommitteeSection';
import ExecutiveMembersSection from '@/src/components/marketing/ExecutiveMembersSection';
import TrusteesSection from '@/src/components/marketing/TrusteesSection';

export default function HomePage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePage();
  }, []);

  const fetchHomePage = async () => {
    try {
      const res = await fetch('http://localhost:5000/pages/slug/home');
      const data = await res.json();
      setPageData(data);
    } catch (err) {
      console.error('Failed to fetch home page:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Page not found</p>
      </div>
    );
  }

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} data={section.props} />;
      case 'action_buttons':
        return <ActionButtonsSection key={section.id} data={section.props} />;
      case 'sponsors':
        return <SponsorsSection key={section.id} data={section.props} />;
      case 'image_slider':
        return <ImageSliderSection key={section.id} data={section.props} />;
      case 'committee':
        return <CommitteeSection key={section.id} data={section.props} />;
      case 'executive_members':
        return <ExecutiveMembersSection key={section.id} data={section.props} />;
      case 'trustees':
        return <TrusteesSection key={section.id} data={section.props} />;
      default:
        return null;
    }
  };

  return (
    <>
      {pageData.sections
        .filter((section: any) => section.isVisible)
        .sort((a: any, b: any) => a.order - b.order)
        .map(renderSection)}
    </>
  );
}