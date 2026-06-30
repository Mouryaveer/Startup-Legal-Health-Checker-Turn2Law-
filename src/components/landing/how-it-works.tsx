"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import {
  ClipboardList,
  BarChart3,
  AlertCircle,
  PhoneCall,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Answer Questions",
    description:
      "Complete a guided assessment covering 7 critical legal areas — company formation, IP, employment, contracts, data privacy, regulatory, and founder agreements.",
    detail: "~10 minutes",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Get Your Score",
    description:
      "Receive an instant legal health score (0–100) with a detailed breakdown by category, showing exactly where you stand.",
    detail: "Instant results",
  },
  {
    icon: AlertCircle,
    number: "03",
    title: "See Your Risks",
    description:
      "View a prioritized risk matrix highlighting critical, high, medium, and low-risk areas with specific remediation steps.",
    detail: "Actionable insights",
  },
  {
    icon: PhoneCall,
    number: "04",
    title: "Get Expert Help",
    description:
      "Download your report, share it with your team, and book a consultation with Turn2Law's legal experts to fix identified gaps.",
    detail: "Professional support",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-white relative" id="how-it-works">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8E5F28] bg-[#FDF8EF] rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight mb-4">
              Four Steps to Legal Clarity
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              From questions to actionable recommendations in under 10 minutes. No jargon, no ambiguity.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E8E1D5] to-transparent" aria-hidden="true" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.12}>
                <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                  {/* Step number circle */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-[80px] h-[80px] rounded-2xl gold-gradient-bg flex items-center justify-center shadow-[0_4px_20px_rgba(216,160,76,0.2)]">
                      <step.icon className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0A0A0A] text-white text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#0A0A0A]">
                        {step.title}
                      </h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium text-[#D8A04C] bg-[#FDF8EF] rounded-full border border-[#E8D5B0]">
                        {step.detail}
                      </span>
                    </div>
                    <p className="text-[#6B6B6B] leading-relaxed max-w-xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
