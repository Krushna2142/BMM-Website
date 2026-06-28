"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/src/components/ui/Container";
import sliderData from "@/src/data/slider-images.json";

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = sliderData.slides;
  const settings = sliderData.settings;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), settings.pauseDuration);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, settings.autoSlideDelay);

    return () => clearInterval(interval);
  }, [isPaused, goToNext, settings.autoSlideDelay]);

  return (
    <section className="py-16 bg-gray-100">
      <Container>
        {/* Slider Container - Card Style */}
        <div
          className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-black rounded-2xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <Image
                  src={slides[currentIndex].src}
                  alt={slides[currentIndex].alt}
                  fill
                  className="object-contain"
                  priority={currentIndex === 0}
                  sizes="100vw"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          {settings.showArrows && (
            <button
              onClick={goToPrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Right Arrow */}
          {settings.showArrows && (
            <button
              onClick={goToNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Dot Indicators */}
          {settings.showDots && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-3 bg-secondary-500"
                      : "w-3 h-3 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          {settings.showCounter && (
            <div className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {slides.length}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}