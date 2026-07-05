"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { fetchInitiativesPage } from "@/src/lib/api";

interface ActionButton {
  label: string;
  href: string;
  variant: string; // from CMS: 'primary' or 'secondary'
}

interface VolunteerAward {
  title: string;
  buttonLabel: string;
  href: string;
}

// ✅ Map CMS variants to your Button component's accepted variants
// Your Button accepts: "link" | "outline" | "default" | "secondary" | "ghost"
const mapButtonVariant = (cmsVariant: string): "default" | "secondary" | "outline" => {
  if (cmsVariant === "primary") return "secondary"; // primary → orange button
  if (cmsVariant === "secondary") return "default"; // secondary → blue button
  return "default";
};

export function InitiativesButtons() {
  const [topButtons, setTopButtons] = useState<ActionButton[]>([]);
  const [bottomButtons, setBottomButtons] = useState<ActionButton[]>([]);
  const [volunteerAward, setVolunteerAward] = useState<VolunteerAward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchButtons() {
      try {
        const page = await fetchInitiativesPage();
        const sections = page.sections || [];

        const topButtonsSection = sections.find((s: any) => s.type === "top_action_buttons");
        if (topButtonsSection?.props?.buttons) {
          setTopButtons(topButtonsSection.props.buttons);
        }

        const bottomButtonsSection = sections.find((s: any) => s.type === "bottom_action_buttons");
        if (bottomButtonsSection?.props?.buttons) {
          setBottomButtons(bottomButtonsSection.props.buttons);
        }

        const volunteerSection = sections.find((s: any) => s.type === "volunteer_award");
        if (volunteerSection?.props) {
          setVolunteerAward(volunteerSection.props);
        }
      } catch (err) {
        console.error("Failed to fetch buttons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchButtons();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-primary-50">
        <Container>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (topButtons.length === 0 && bottomButtons.length === 0 && !volunteerAward) {
    return null;
  }

  return (
    <>
      {/* Top Action Buttons */}
      {topButtons.length > 0 && (
        <section className="py-12 bg-primary-50">
          <Container>
            <div className="flex flex-wrap justify-center gap-4">
              {topButtons.map((button, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={button.href}>
                    <Button
                      variant={mapButtonVariant(button.variant)}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {button.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Volunteer Award Section */}
      {volunteerAward && (
        <section className="py-12 bg-secondary-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                {volunteerAward.title}
              </h3>
              <Link href={volunteerAward.href}>
                <Button variant="secondary" size="lg">
                  {volunteerAward.buttonLabel}
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Bottom Action Buttons */}
      {bottomButtons.length > 0 && (
        <section className="py-12 bg-primary-50">
          <Container>
            <div className="flex flex-wrap justify-center gap-4">
              {bottomButtons.map((button, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={button.href}>
                    <Button
                      variant={mapButtonVariant(button.variant)}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {button.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}