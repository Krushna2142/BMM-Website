"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/src/components/ui/Container";
import { getHomePageSection } from "@/src/lib/api";

interface ActionButton {
  label: string;
  url: string;
  icon?: string;
}

export function ActionButtonSection() {
  const [buttons, setButtons] = useState<ActionButton[]>([]);

  useEffect(() => {
    async function fetchButtons() {
      try {
        const section = await getHomePageSection("action_buttons");
        if (section?.props?.buttons) {
          setButtons(section.props.buttons);
        }
      } catch (err) {
        console.error("Failed to fetch action buttons:", err);
      }
    }
    fetchButtons();
  }, []);

  if (buttons.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buttons.map((button, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={button.url || '#'}
                className="block p-6 rounded-lg text-center font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-primary-600 hover:bg-primary-700 text-white"
              >
                {button.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}