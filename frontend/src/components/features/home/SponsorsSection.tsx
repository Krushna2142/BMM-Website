"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";
import { getHomePageSection } from "@/src/lib/api";

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const section = await getHomePageSection("sponsors");
        if (section?.props?.sponsors) {
          setSponsors(section.props.sponsors);
        }
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
      }
    }
    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-3">
            Our Partners & Sponsors
          </h2>
          <p className="text-gray-600 text-lg">
            Trusted organizations supporting the Marathi community
          </p>
          <div className="w-24 h-1 bg-secondary-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={index}
              href={sponsor.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group w-[140px] sm:w-[160px] md:w-[180px] h-[90px] md:h-[100px] bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:border-secondary-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-3"
            >
              {sponsor.logo ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="180px"
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-xs text-center">{sponsor.name}</div>
              )}
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}