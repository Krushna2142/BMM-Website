"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";
import { fetchInitiativesPage } from "@/src/lib/api";

export function InitiativesHero() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      try {
        const page = await fetchInitiativesPage();
        const hero = page.sections?.find((s: any) => s.type === "hero");
        if (hero) {
          // Fix relative URLs
          const backgroundImage = hero.props?.backgroundImage;
          if (backgroundImage && !backgroundImage.startsWith('http')) {
            hero.props.backgroundImage = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${backgroundImage}`;
          }
          setSectionData(hero);
        }
      } catch (err) {
        console.error("Failed to fetch initiatives hero:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </section>
    );
  }

  const backgroundImage = sectionData?.props?.backgroundImage || "/images/bg.png";
  const title = sectionData?.props?.title || "BMM Initiatives";
  const descriptionEn = sectionData?.props?.descriptionEn || "As you are aware, BMM is bringing so many initiatives to you...";
  const descriptionMr = sectionData?.props?.descriptionMr || "तुम्हाला माहितच आहे की बृहन्महाराष्ट्र मंडळ तुमच्यासाठी अनेक उपक्रम राबवत आहे...";

  return (
    <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="BMM Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={(e) => {
            console.error("Failed to load background image:", backgroundImage);
            // Fallback to gradient if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-primary-950/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}