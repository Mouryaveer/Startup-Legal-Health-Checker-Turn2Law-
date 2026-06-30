"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Scale, FileCheck } from "lucide-react";
import { ParticleBackground } from "@/components/ui/particle-background";

const floatingIcons = [
  { Icon: Shield, x: "10%", y: "20%", delay: 0, size: 28 },
  { Icon: Scale, x: "85%", y: "30%", delay: 0.5, size: 24 },
  { Icon: FileCheck, x: "75%", y: "70%", delay: 1, size: 22 },
];

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEFCF9] via-white to-white" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(216,160,76,0.06)_0%,transparent_60%)]" aria-hidden="true" />

      {/* Particles */}
      <div className="absolute inset-0">
        <ParticleBackground count={40} />
      </div>

      {/* Floating legal icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center w-12 h-12 rounded-2xl glass-panel-gold"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: delay + 0.8, duration: 0.6 },
            scale: { delay: delay + 0.8, duration: 0.6 },
            y: { delay: delay + 1.2, duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <Icon className="text-[#D8A04C]" size={size} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] text-sm text-[#8E5F28] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D8A04C]" aria-hidden="true" />
            Free for Indian Startups · Takes 10 Minutes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0A0A0A] leading-[1.08] tracking-tight mb-6"
        >
          Know Your Startup&apos;s
          <br />
          <span className="gold-gradient-text">Legal Health Score</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#6B6B6B] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Answer targeted questions across 7 critical legal areas. Get an instant compliance
          score, identify risks, and receive actionable recommendations — all in under 10 minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* Primary CTA */}
          <Link href="/assessment">
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              {/* Glow ring */}
              <motion.div
                className="absolute -inset-1 rounded-2xl gold-gradient-bg opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"
                animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
                aria-hidden="true"
              />
              <span className="relative inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white gold-gradient-bg rounded-xl shadow-[0_2px_12px_rgba(216,160,76,0.25)] hover:shadow-[0_8px_30px_rgba(216,160,76,0.35)] transition-shadow duration-300">
                Start Free Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </span>
            </motion.div>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] border border-[#E8E1D5] hover:border-[#D8A04C]/30 rounded-xl transition-all duration-300 hover:bg-[#FDF8EF]"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#9B9B9B]"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
            No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
            100% confidential
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
            Instant results
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
            Built by legal experts
          </span>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
    </section>
  );
}
