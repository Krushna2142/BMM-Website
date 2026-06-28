"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";
import committeeData from "@/src/data/committee-members.json";

interface CommitteeMember {
  id: number;
  name: string;
  nameMarathi: string;
  position: string;
  positionMarathi: string;
  image: string;
}

interface CommitteeSection {
  id: string;
  title: string;
  titleMarathi?: string;
  centered?: boolean;
  members: CommitteeMember[];
}

interface CommitteeSectionProps {
  section: CommitteeSection;
  startIndex: number;
}

function CommitteeSection({ section, startIndex }: CommitteeSectionProps) {
  // Determine grid columns based on section type
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
      {/* Section Title */}
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

      {/* Members Grid */}
      <div className={`grid gap-8 ${getGridCols()} justify-items-center`}>
        {section.members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (startIndex + index) * 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Circular Image Container */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4 overflow-hidden rounded-full bg-white shadow-lg">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>

            {/* Name and Position */}
            <div className="text-center px-2">
              <h4 className="text-base md:text-lg font-semibold text-primary-800 mb-1">
                {member.nameMarathi}
              </h4>
              {member.positionMarathi && (
                <p className="text-xs md:text-sm text-gray-600">
                  {member.positionMarathi}
                </p>
              )}
              {member.position && member.position !== "Executive Member" && (
                <p className="text-xs md:text-sm text-gray-600">
                  {member.position}
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
  const sections = committeeData.sections;
  
  let startIndex = 0;

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        {sections.map((section) => {
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