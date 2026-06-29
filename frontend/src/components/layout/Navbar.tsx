"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAVIGATION_ITEMS } from "@/src/constants/index";
import { cn } from "@/src/lib/utils";

export function Navbar() {
  const pathname = usePathname();
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
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 pt-4",
          isScrolled ? "bg-transparent" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Made Bigger */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/BMMLogo.png"
                alt="BMM Logo"
                width={120}
                height={120}
                className={cn(
                  "h-60 w-60 md:h-40 md:w-40 object-contain transition-all duration-500",
                  isScrolled ? "drop-shadow-none" : "drop-shadow-lg"
                )}
                priority
              />
            </Link>

            {/* Extended Navigation Pill with Everything Inside */}
            <div className={cn(
              "hidden lg:flex items-center backdrop-blur-md rounded-full px-8 py-2 transition-all duration-500",
              isScrolled
                ? "bg-white/90 border border-white/50 shadow-lg"
                : "bg-white/20 border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            )}>
              {/* Navigation Links */}
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full",
                      isActive
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : isScrolled
                          ? "text-gray-800 hover:text-orange-600 hover:bg-orange-50"
                          : "text-white hover:text-orange-300 hover:bg-white/20"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className={cn(
                "w-px h-6 mx-4 transition-colors duration-500",
                isScrolled ? "bg-gray-300" : "bg-white/50"
              )} />

              {/* Advertise Button Inside Pill */}
              <button className={cn(
                "px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105",
                isScrolled
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-md"
              )}>
                Advertise With Us
              </button>

              {/* App Icon Inside Pill */}
              <a
                href="https://bmmseattle2026.org"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "ml-3 p-1.5 rounded-full transition-all duration-300 hover:scale-110",
                  isScrolled
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-white/30 hover:bg-white/40"
                )}
              >
                <Image
                  src="/images/Seattle.png"
                  alt="Seattle 2026"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-full transition-all duration-300",
                isScrolled
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              )}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="px-4 py-6 space-y-2">
              <div className="flex justify-center mb-6 pb-4 border-b border-gray-200">
                <Image
                  src="/images/BMMLogo.png"
                  alt="BMM Logo"
                  width={100}
                  height={100}
                  className="h-24 w-24 object-contain"
                />
              </div>

              {NAVIGATION_ITEMS.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300",
                        isActive
                          ? "text-orange-600 bg-orange-50 border-l-4 border-orange-600"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => setActiveLang("mr")}
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    activeLang === "mr"
                      ? "text-orange-600 font-bold"
                      : "text-gray-600 hover:text-orange-600"
                  )}
                >
                  मराठी
                </button>

                <span className="text-gray-400">|</span>

                <button
                  onClick={() => setActiveLang("en")}
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    activeLang === "en"
                      ? "text-orange-600 font-bold"
                      : "text-gray-600 hover:text-orange-600"
                  )}
                >
                  EN
                </button>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAVIGATION_ITEMS.length * 0.05 }}
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                Advertise With Us
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}