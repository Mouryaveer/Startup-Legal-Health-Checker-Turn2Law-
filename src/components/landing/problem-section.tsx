"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  AlertTriangle,
  TrendingDown,
  Users,
} from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    stat: "78%",
    title: "Face Legal Challenges",
    description:
      "of Indian startups encounter preventable legal issues within their first two years of operation.",
    color: "#EA580C",
  },
  {
    icon: TrendingDown,
    stat: "₹15L+",
    title: "Average Compliance Cost",
    description:
      "is spent on resolving legal issues that could have been avoided with proper early-stage compliance.",
    color: "#DC2626",
  },
  {
    icon: Users,
    stat: "3 in 5",
    title: "Co-Founder Disputes",
    description:
      "startups face co-founder conflicts due to missing or inadequate shareholder agreements.",
    color: "#D97706",
  },
];

export function ProblemSection() {
  return (
    <section className="section-padding bg-white relative" id="problem">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#DC2626] bg-red-50 rounded-full mb-4">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight mb-4">
              Legal Blind Spots Kill Startups
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              Most founders don&apos;t know what they don&apos;t know. Legal gaps compound silently
              until they become expensive emergencies.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <ScrollReveal key={problem.title} delay={index * 0.1}>
              <TiltCard tiltAmount={6}>
                <motion.div
                  className="relative p-8 rounded-2xl bg-[#FEFCF9] border border-[#E8E1D5] hover:border-[#D8A04C]/30 transition-all duration-500 h-full group"
                  whileHover={{
                    boxShadow: "0 20px 60px rgba(10, 10, 10, 0.08)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${problem.color}10` }}
                  >
                    <problem.icon
                      className="w-6 h-6"
                      style={{ color: problem.color }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Stat */}
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: problem.color }}
                  >
                    {problem.stat}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Decorative corner gradient */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top right, ${problem.color}08, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
