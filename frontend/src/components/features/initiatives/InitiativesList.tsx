"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/src/components/ui/Container";
import { fetchInitiativesPage } from "@/src/lib/api";

interface Initiative {
  nameMr: string;
  nameEn: string;
  subtitle?: string;
  href: string;
}

export function InitiativesList() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitiatives() {
      try {
        const page = await fetchInitiativesPage();
        const initiativesSection = page.sections?.find((s: any) => s.type === "initiatives_list");
        if (initiativesSection?.props?.initiatives) {
          setInitiatives(initiativesSection.props.initiatives);
        }
      } catch (err) {
        console.error("Failed to fetch initiatives:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInitiatives();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading initiatives...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (initiatives.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={initiative.href}
                className="block p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700">
                  {initiative.nameEn}
                </h3>
                <p className="text-lg text-primary-700 mb-3" style={{ fontFamily: 'system-ui' }}>
                  {initiative.nameMr}
                </p>
                {initiative.subtitle && (
                  <p className="text-sm text-gray-600">
                    {initiative.subtitle}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}