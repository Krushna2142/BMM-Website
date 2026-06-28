"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/src/components/ui/Container";
import initiativesData from "@/src/data/initiatives.json";
import { cn } from "@/src/lib/utils";

export default function InitiativesPage() {
  const { page, actionButtons, initiatives, bottomButtons, volunteerAward } = initiativesData;

  return (
    <>
      {/* Hero Banner with bg.png */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/bg.png"
          alt="BMM Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-primary-950/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            {page.title}
          </motion.h1>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-700 leading-relaxed"
            >
              {page.descriptionEn}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-700 leading-relaxed"
              style={{ fontFamily: 'system-ui' }}
            >
              {page.descriptionMr}
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {actionButtons.map((button, index) => (
              <motion.div
                key={button.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={button.href}
                  className={cn(
                    "px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 hover:scale-105",
                    button.variant === "primary"
                      ? "bg-secondary-500 hover:bg-secondary-600 text-white"
                      : "bg-primary-800 hover:bg-primary-900 text-white"
                  )}
                >
                  {button.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Initiatives Grid */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.05 }}
              >
                <Link
                  href={initiative.href}
                  className="block border-2 border-gray-800 rounded-md p-6 text-center hover:bg-gray-50 hover:shadow-md transition-all duration-300 group h-[160px] flex flex-col items-center justify-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-800 transition-colors">
                    {initiative.nameMr}
                  </h3>
                  <p className="text-base font-medium text-gray-700 mb-2">
                    {initiative.nameEn}
                  </p>
                  {initiative.subtitle && (
                    <p className="text-xs text-red-600 font-medium leading-tight">
                      {initiative.subtitle}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom Buttons */}
      <section className="py-8 bg-white">
        <Container>
          <div className="flex justify-center gap-4">
            {bottomButtons.map((button) => (
              <Link
                key={button.id}
                href={button.href}
                className={cn(
                  "px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 hover:scale-105",
                  button.variant === "primary"
                    ? "bg-secondary-500 hover:bg-secondary-600 text-white"
                    : "bg-primary-800 hover:bg-primary-900 text-white"
                )}
              >
                {button.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Volunteer Award Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
            >
              {volunteerAward.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={volunteerAward.href}
                className="inline-block bg-primary-800 hover:bg-primary-900 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:scale-105"
              >
                {volunteerAward.buttonLabel}
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
