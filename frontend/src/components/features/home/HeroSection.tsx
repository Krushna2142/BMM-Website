"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getHomePageSection } from "@/src/lib/api";

export function HeroSection() {
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const hero = await getHomePageSection("hero");
        if (hero) setSectionData(hero);
      } catch (err) {
        console.error("Failed to fetch hero section:", err);
      }
    }
    fetchHero();
  }, []);

  const imageUrl = sectionData?.props?.backgroundImage
    ? `${sectionData.props.backgroundImage}?t=${Date.now()}`
    : "/images/bg.png";

  const title = sectionData?.props?.title || "Welcome to Bruhan Maharashtra Mandal of North America (BMM)";
  const subtitleMarathi = sectionData?.props?.subtitleMarathi || "|| मराठी तितुका मेळवावा ||";
  const subtitleEnglish = sectionData?.props?.subtitleEnglish || "Uniting the Marathi speaking community";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-2 font-medium drop-shadow-md"
        >
          {subtitleMarathi}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl mb-8 drop-shadow-md"
        >
          {subtitleEnglish}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="/about" className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg transition-all">
            Learn More
          </a>
          <a href="/contact" className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold rounded-lg shadow-lg transition-all">
            Get Involved
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div className="flex justify-center gap-8 md:gap-16 text-white">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">60+</div>
            <div className="text-sm md:text-base opacity-80">Chapters Across North America</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">100+</div>
            <div className="text-sm md:text-base opacity-80">Events Per Year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">10K+</div>
            <div className="text-sm md:text-base opacity-80">Community Members</div>
          </div>
        </div>
      </div>
    </section>
  );
}