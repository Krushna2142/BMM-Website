"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { QUICK_LINKS } from "@/src/constants";
import { Container } from "@/src/components/ui/Container";
import { cn } from "@/src/lib/utils";

export function QuickLinks() {
  return (
    <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUICK_LINKS.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className={cn(
                  "block p-6 rounded-lg text-center font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
                  link.variant === "primary"
                    ? "bg-secondary-500 hover:bg-secondary-600 text-white"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                )}
              >
                {link.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
