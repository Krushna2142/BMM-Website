'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '@/src/lib/api';
import Image from 'next/image';
import Link from 'next/link';

interface Founder {
  name: string;
  years: string;
  image: string;
}

interface Initiative {
  name: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

export default function AboutPage() {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const response = await publicApi.get('/pages/slug/about');
      setPage(response.data);
    } catch (error) {
      console.error('Failed to fetch about page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {page.sections?.map((section: any, index: number) => (
        <SectionRenderer key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}

function SectionRenderer({ section, index }: { section: any; index: number }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} index={index} />;
    case 'content':
      return <ContentSection section={section} index={index} />;
    case 'founders':
      return <FoundersSection section={section} index={index} />;
    case 'vision_mission_values':
      return <VisionMissionValuesSection section={section} index={index} />;
    case 'initiatives':
      return <InitiativesSection section={section} index={index} />;
    case 'stats':
      return <StatsSection section={section} index={index} />;
    default:
      return null;
  }
}

function HeroSection({ section, index }: { section: any; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {section.props?.title}
        </h1>
        <p className="text-xl md:text-2xl text-red-100">
          {section.props?.subtitle}
        </p>
      </div>
    </motion.section>
  );
}

function ContentSection({ section, index }: { section: any; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="py-16 bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {section.props?.title}
        </h2>
        <div className="prose prose-lg prose-red mx-auto">
          {section.props?.content?.split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FoundersSection({ section, index }: { section: any; index: number }) {
  const founders: Founder[] = section.props?.founders || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {section.props?.title}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {section.props?.subtitle}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center"
            >
              <div className="w-48 h-48 mx-auto mb-4 relative rounded-full overflow-hidden border-4 border-red-900">
                <Image
                  src={founder.image || '/images/placeholder-founder.jpg'}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{founder.name}</h3>
              <p className="text-red-700 font-medium">{founder.years}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function VisionMissionValuesSection({ section, index }: { section: any; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-900 to-red-800 text-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">{section.props?.vision?.title}</h3>
            <p className="text-red-100 leading-relaxed">
              {section.props?.vision?.content}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">{section.props?.mission?.title}</h3>
            <p className="text-orange-100 leading-relaxed">
              {section.props?.mission?.content}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-800 to-red-900 text-white p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">{section.props?.values?.title}</h3>
            <p className="text-red-100 leading-relaxed">
              {section.props?.values?.content}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function InitiativesSection({ section, index }: { section: any; index: number }) {
  const initiatives: Initiative[] = section.props?.initiatives || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {section.props?.title}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {section.props?.subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((initiative, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-bold text-red-900 mb-2">
                {initiative.name}
              </h3>
              <p className="text-gray-600 text-sm">{initiative.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function StatsSection({ section, index }: { section: any; index: number }) {
  const stats: Stat[] = section.props?.stats || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="py-16 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          {section.props?.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-red-200">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}