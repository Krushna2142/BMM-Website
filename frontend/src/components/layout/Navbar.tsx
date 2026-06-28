"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/src/constants";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-primary-900/95 backdrop-blur-md shadow-2xl mx-4 mt-4 rounded-full border border-white/10"
            : "bg-transparent"
        )}
      >
        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isScrolled ? "max-w-7xl" : "max-w-7xl"
        )}>
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-white font-bold text-2xl group-hover:text-secondary-400 transition-colors">
                BMM
              </div>
              <div className="text-primary-200 text-xs hidden sm:block">
                बृहन्महाराष्ट्र मंडळ
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Advertise Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-secondary-500/30">
                Advertise with us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-primary-900/98 backdrop-blur-md shadow-2xl"
          >
            <div className="px-4 py-6 space-y-3">
              {NAVIGATION_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAVIGATION_ITEMS.length * 0.05 }}
                className="w-full mt-6 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
              >
                Advertise with us
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}