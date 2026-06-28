"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  // For now, use default image directly
  // Backend integration will be added later
  const imageUrl = "/images/bg.png";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="BMM Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/50 to-primary-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Welcome to Bruhan Maharashtra Mandal of North America (BMM)
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 space-y-2"
          >
            <span className="block text-lg md:text-xl text-secondary-400 font-medium">
              || मराठी तितुका मेळवावा ||
            </span>
            <span className="block">Uniting the Marathi speaking community</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-secondary-500/30 min-w-[200px]">
              Learn More
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 min-w-[200px]">
              Get Involved
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-white"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-secondary-400 mb-2">60+</div>
              <div className="text-sm text-white/70">Chapters Across North America</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-secondary-400 mb-2">100+</div>
              <div className="text-sm text-white/70">Events Per Year</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-secondary-400 mb-2">10K+</div>
              <div className="text-sm text-white/70">Community Members</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}