"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  { value: 500, suffix: "+", label: "Startups Assessed" },
  { value: 7, suffix: "", label: "Legal Categories" },
  { value: 60, suffix: "+", label: "Assessment Questions" },
  { value: 10, suffix: " min", label: "Average Completion" },
];

export function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(216,160,76,0.08)_0%,transparent_60%)]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={2}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text-light"
                />
                <p className="text-sm text-[#9B9B9B] mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
