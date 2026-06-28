"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAVIGATION_ITEMS } from "@/src/constants";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<"mr" | "en">("en");

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
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/BMMLogo.png"
                alt="BMM Logo"
                width={80}
                height={80}
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
                priority
              />
            </Link>

            {/* White Rounded Navigation Bar with Shadow */}
            <div className="hidden lg:flex items-center bg-white rounded-full shadow-lg border border-gray-100 px-2 py-1.5">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    item.href === "/"
                      ? "text-orange-600 border-2 border-gray-800 bg-white"
                      : "text-gray-700 hover:text-orange-600"
                  )}
                >
                  {item.label}
                  {item.href === "/" && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side: Language + Advertise */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <button
                  onClick={() => setActiveLang("mr")}
                  className={cn(
                    "transition-colors",
                    activeLang === "mr" ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-600"
                  )}
                >
                  मराठी
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => setActiveLang("en")}
                  className={cn(
                    "transition-colors",
                    activeLang === "en" ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-600"
                  )}
                >
                  EN
                </button>
              </div>

              {/* Advertise Button - Orange Gradient */}
              <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Advertise with us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20 md:h-24" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              <div className="flex justify-center mb-6 pb-4 border-b border-gray-100">
                <Image
                  src="/images/BMMLogo.png"
                  alt="BMM Logo"
                  width={60}
                  height={60}
                  className="h-16 w-16 object-contain"
                  priority
                />
              </div>

              {NAVIGATION_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      item.href === "/"
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => setActiveLang("mr")}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    activeLang === "mr" ? "text-orange-600 font-bold" : "text-gray-600"
                  )}
                >
                  मराठी
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => setActiveLang("en")}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    activeLang === "en" ? "text-orange-600 font-bold" : "text-gray-600"
                  )}
                >
                  EN
                </button>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAVIGATION_ITEMS.length * 0.05 }}
                className="w-full mt-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg"
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