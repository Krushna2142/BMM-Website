"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";

interface Sponsor {
  id: number;
  name: string;
  image: string;
  website?: string;
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "Avant",
    image: "/images/sponsors/avant.png",
    website: "https://avant.com",
  },
  {
    id: 2,
    name: "Clickontours",
    image: "/images/sponsors/clickontours.png",
    website: "https://clickontours.com",
  },
  {
    id: 3,
    name: "VSS Foundation",
    image: "/images/sponsors/VSSF.png",
    website: "https://vssfoundation.org",
  },
  {
    id: 4,
    name: "Avana Senior Care",
    image: "/images/sponsors/avana.png",
    website: "https://avanaseniorcare.com",
  },
  {
    id: 5,
    name: "MI Adventures",
    image: "/images/sponsors/miadventures.png",
    website: "https://miadventures.com",
  },
  {
    id: 6,
    name: "Chugh",
    image: "/images/sponsors/chugh.png",
    website: "https://chugh.com",
  },
];

export function SponsorsSection() {
  return (
    <section className="py-16 bg-white">
      <Container>
        {/* Section Header */}
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

        {/* Sponsors - All in Single Line */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group w-[140px] sm:w-[160px] md:w-[180px] h-[90px] md:h-[100px] bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:border-secondary-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-3"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  sizes="180px"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
