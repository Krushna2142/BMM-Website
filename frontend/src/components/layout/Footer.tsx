"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { FaTwitter, FaYoutube} from "react-icons/fa";
import { NAVIGATION_ITEMS, SOCIAL_LINKS } from "@/src/constants";
import { Container } from "@/src/components/ui/Container";
import { FaFacebook } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-primary-950 text-white"
    >
      <Container>
        <div className="py-12">
          {/* Logo and Description */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">BMM</div>
            <div className="text-primary-300 text-sm">बृहन्महाराष्ट्र मंडळ</div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-primary-200 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-8">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary-800 rounded-full hover:bg-primary-700 transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary-800 rounded-full hover:bg-primary-700 transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary-800 rounded-full hover:bg-primary-700 transition-colors"
            >
              <FaYoutube size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-primary-400 border-t border-primary-800 pt-8">
            © {currentYear} Bruhan Maharashtra Mandal of N.A.
          </div>
        </div>
      </Container>
    </motion.footer>
  );
}