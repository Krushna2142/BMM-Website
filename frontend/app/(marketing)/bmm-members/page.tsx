'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { publicApi } from '@/src/lib/api';
import Image from 'next/image';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  website: string | null;
  logo: string | null;
  category: string;
  sortOrder: number;
}

// ✅ Helper function to format URLs
const formatUrl = (url: string | null) => {
  if (!url || url.trim() === '') return '#';
  // If it already has http:// or https://, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Otherwise, automatically add https://
  return `https://${url}`;
};

export default function BMMMembersPage() {
  const [regularMembers, setRegularMembers] = useState<Member[]>([]);
  const [associateMembers, setAssociateMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Fetch ALL members
      const allRes = await publicApi.get('/members/public');
      const allData = allRes.data;

      // Separate regular (58) and associate (2)
      const regular = allData.filter((m: Member) => m.category === 'member');
      const associate = allData.filter((m: Member) => m.category === 'associate');

      // Sort both by sortOrder
      regular.sort((a: Member, b: Member) => (a.sortOrder || 0) - (b.sortOrder || 0));
      associate.sort((a: Member, b: Member) => (a.sortOrder || 0) - (b.sortOrder || 0));

      setRegularMembers(regular);

      // Combine for associate section: 58 regular + 2 associate = 60 total
      const allForAssociate = [...regular, ...associate].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      );
      setAssociateMembers(allForAssociate);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r pt-28 from-red-900 via-red-800 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            🇺🇸 50+ Marathi/Maharashtra Mandals in the USA and Canada under the BMM umbrella 🇨🇦
          </h1>
        </div>
      </section>

      {/* New Mandal Onboarding Process Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Link
            href="/new-mandal-onboarding" // Update this with actual URL
            className="inline-flex items-center justify-center px-8 py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors shadow-lg"
          >
            New Mandal Onboarding Process
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Regular Members Section (58 Members) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {regularMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Associate Members Section (60 Members: 58 Regular + 2 Associate) */}
      {!loading && associateMembers.length > 0 && (
        <div className="bg-gray-50 py-12 mt-12 border-t-4 border-red-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Associate Member Organizations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {associateMembers.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  // ✅ Format the URL before using it
  const formattedUrl = formatUrl(member.website);
  const hasValidWebsite = member.website && member.website.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 group text-center p-6 flex flex-col items-center"
    >
      {/* Logo */}
      {member.logo ? (
        <div className="mb-4 h-20 w-full flex items-center justify-center">
          <Image
            src={member.logo}
            alt={member.name}
            width={80}
            height={80}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
          />
        </div>
      ) : (
        <div className="mb-4 h-20 w-full flex items-center justify-center bg-gray-100 rounded-lg">
          <Globe className="w-10 h-10 text-gray-400" />
        </div>
      )}

      {/* City Name - Large Red Text */}
      <h3 className="text-2xl font-bold text-red-900 mb-1">{member.city}</h3>
      
      {/* Organization Name - Smaller Black Text */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[2.5rem]">{member.name}</p>

      {/* ✅ Button - "Visit Our Website" - WITH FIXED URL */}
      <a
        href={formattedUrl} // 👈 Use the formatted URL
        target={hasValidWebsite ? '_blank' : undefined}
        rel={hasValidWebsite ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
          hasValidWebsite 
            ? 'bg-red-900 text-white hover:bg-red-800 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={(e) => {
          if (!hasValidWebsite) {
            e.preventDefault(); // Prevent click if no website
          }
        }}
      >
        Visit Our Website
        <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </motion.div>
  );
}