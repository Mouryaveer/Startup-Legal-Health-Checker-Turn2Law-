"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Clock,
  FileSearch,
  BarChart3,
  Handshake,
} from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Identify Hidden Risks",
    description: "Uncover legal gaps you didn't know existed across incorporation, IP, employment, and compliance.",
  },
  {
    icon: Clock,
    title: "Save Time & Money",
    description: "Proactive compliance is 10x cheaper than reactive legal fixes. Know your gaps before investors do.",
  },
  {
    icon: BarChart3,
    title: "Measurable Score",
    description: "Get a quantified health score across 7 legal categories, not vague advice — concrete, actionable metrics.",
  },
  {
    icon: FileSearch,
    title: "Actionable Recommendations",
    description: "Receive prioritized remediation steps ranked by urgency, with estimated cost and timeline for each.",
  },
  {
    icon: Shield,
    title: "Investor Ready",
    description: "Clean up your legal house before due diligence. Show investors you take compliance seriously.",
  },
  {
    icon: Handshake,
    title: "Expert Follow-Up",
    description: "Connect directly with Turn2Law's legal team for remediation. We fix what we find.",
  },
];

export function BenefitsSection() {
  return (
    <section className="section-padding relative overflow-hidden" id="benefits">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FEFCF9] to-white" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(216,160,76,0.04)_0%,transparent_50%)]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8E5F28] bg-[#FDF8EF] rounded-full mb-4">
              Why Use This
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight mb-4">
              Built for Startup Founders
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              Everything you need to understand your legal position and take action — in one assessment.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 0.08}>
              <TiltCard tiltAmount={5}>
                <motion.div
                  className="relative p-7 rounded-2xl bg-white border border-[#E8E1D5] hover:border-[#D8A04C]/30 h-full group transition-all duration-500"
                  whileHover={{
                    boxShadow: "0 12px 40px rgba(216, 160, 76, 0.1)",
                  }}
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-[#FDF8EF] flex items-center justify-center mb-5 group-hover:bg-[#D8A04C]/10 transition-colors duration-300">
                    <benefit.icon className="w-5.5 h-5.5 text-[#D8A04C]" aria-hidden="true" />
                  </div>

                  <h3 className="text-base font-semibold text-[#0A0A0A] mb-2">
                    {benefit.title}
                  </h3>

                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D8A04C]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
