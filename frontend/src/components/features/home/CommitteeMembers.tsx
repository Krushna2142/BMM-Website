"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";
import { getHomePageSection } from "@/src/lib/api";

interface CommitteeMember {
  name: string;
  nameMarathi?: string;
  role: string;
  image?: string;
}

interface CommitteeSection {
  id: string;
  title: string;
  titleMarathi?: string;
  members: CommitteeMember[];
}

interface CommitteeSectionProps {
  section: CommitteeSection;
  startIndex: number;
}

function CommitteeSection({ section, startIndex }: CommitteeSectionProps) {
  const getGridCols = () => {
    if (section.id === "executive-committee") {
      return "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5";
    }
    if (section.id === "board-of-trustees") {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="mb-20" id={section.id}>
      <div className="text-center mb-12">
        {section.titleMarathi && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'system-ui' }}>
            {section.titleMarathi}
          </h2>
        )}
        <h3 className="text-2xl md:text-3xl font-bold text-primary-800">
          {section.title}
        </h3>
      </div>

      <div className={`grid gap-8 ${getGridCols()} justify-items-center`}>
        {section.members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (startIndex + index) * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4 overflow-hidden rounded-full bg-white shadow-lg">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Photo</span>
                </div>
              )}
            </div>

            <div className="text-center px-2">
              <h4 className="text-base md:text-lg font-semibold text-primary-800 mb-1">
                {member.nameMarathi || member.name}
              </h4>
              {member.role && (
                <p className="text-xs md:text-sm text-gray-600">
                  {member.role}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CommitteeMembers() {
  const [committee, setCommittee] = useState<CommitteeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommittee() {
      try {
        const committeeSection = await getHomePageSection("committee");
        const executiveSection = await getHomePageSection("executive_members");
        const trusteesSection = await getHomePageSection("trustees");
        
        const sections: CommitteeSection[] = [];
        
        if (committeeSection?.props?.members) {
          sections.push({
            id: "main-committee",
            title: "BMM Committee 2024 - 26",
            titleMarathi: "बृहन्महाराष्ट्र मंडळ समिती २०२४ - २६",
            members: committeeSection.props.members
          });
        }
        
        if (executiveSection?.props?.members) {
          sections.push({
            id: "executive-committee",
            title: "Executive Committee Members",
            titleMarathi: "कार्यकारी समिती सदस्य",
            members: executiveSection.props.members
          });
        }
        
        if (trusteesSection?.props?.trustees) {
          sections.push({
            id: "board-of-trustees",
            title: "Board of Trustees",
            titleMarathi: "बृहन्महाराष्ट्र मंडळ विश्वस्त",
            members: trusteesSection.props.trustees
          });
        }
        
        setCommittee(sections);
      } catch (err) {
        console.error("Failed to fetch committee:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCommittee();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading committee members...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (committee.length === 0) return null;

  let startIndex = 0;

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        {committee.map((section) => {
          const currentStartIndex = startIndex;
          startIndex += section.members.length;
          
          return (
            <CommitteeSection
              key={section.id}
              section={section}
              startIndex={currentStartIndex}
            />
          );
        })}
      </Container>
    </section>
  );
}