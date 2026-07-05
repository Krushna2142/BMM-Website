'use client';

import { useEffect, useState } from 'react';
import { InitiativesHero } from '@/src/components/features/initiatives/InitiativesHero';
import { InitiativesButtons } from '@/src/components/features/initiatives/InitiativesButtons';
import { InitiativesList } from '@/src/components/features/initiatives/InitiativesList';
import { fetchInitiativesPage } from '@/src/lib/api';
import { CustomSection } from '@/src/components/features/initiatives/CustomSection';

// Simple button section
function ButtonSection({ buttons }: { buttons: any[] }) {
  if (!buttons || buttons.length === 0) return null;

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {buttons.map((button, index) => (
            <a
              key={index}
              href={button.url || button.href || '#'}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 hover:scale-105 ${button.variant === 'primary'
                  ? 'bg-secondary-500 hover:bg-secondary-600 text-white'
                  : 'bg-primary-800 hover:bg-primary-900 text-white'
                }`}
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Volunteer Award section
function VolunteerAwardSection({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {data.title}
        </h2>
        <a
          href={data.href}
          className="inline-block bg-primary-800 hover:bg-primary-900 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:scale-105"
        >
          {data.buttonLabel}
        </a>
      </div>
    </section>
  );
}

// Description Text Section (Bilingual)
function DescriptionTextSection({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {data.titleEn && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {data.titleEn}
          </h2>
        )}
        {data.descriptionEn && (
          <p className="text-gray-700 leading-relaxed text-lg">
            {data.descriptionEn}
          </p>
        )}
        {data.titleMr && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'system-ui' }}>
            {data.titleMr}
          </h2>
        )}
        {data.descriptionMr && (
          <p className="text-gray-700 leading-relaxed text-lg" style={{ fontFamily: 'system-ui' }}>
            {data.descriptionMr}
          </p>
        )}
      </div>
    </section>
  );
}

export default function InitiativesPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const page = await fetchInitiativesPage();
        const sortedSections = (page.sections || []).sort((a: any, b: any) => a.order - b.order);
        setSections(sortedSections);
      } catch (err) {
        console.error('Failed to fetch initiatives page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return <InitiativesHero key={section.id} />;

      case 'top_action_buttons':
        return <ButtonSection key={section.id} buttons={section.props?.buttons} />;

      case 'bottom_action_buttons':
        return <ButtonSection key={section.id} buttons={section.props?.buttons} />;

      case 'initiatives_list':
        return <InitiativesList key={section.id} />;

      case 'volunteer_award':
        return <VolunteerAwardSection key={section.id} data={section.props} />;

      case 'description_text':
        return <DescriptionTextSection key={section.id} data={section.props} />;
      case 'custom_section':
        return <CustomSection key={section.id} data={section.props} />;
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  return (
    <>
      {sections
        .filter((section) => section.isVisible)
        .map(renderSection)}
    </>
  );
}