"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" id="cta">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(216,160,76,0.12)_0%,transparent_50%)]" aria-hidden="true" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-[15%] w-64 h-64 rounded-full bg-[#D8A04C]/5 blur-[80px]"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-[#8E5F28]/8 blur-[60px]"
        animate={{
          x: [0, -15, 0],
          y: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel-gold mb-8"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(216, 160, 76, 0)",
                "0 0 0 12px rgba(216, 160, 76, 0.08)",
                "0 0 0 0 rgba(216, 160, 76, 0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-[#D8A04C]" aria-hidden="true" />
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
            Don&apos;t Wait for Legal Problems
            <br />
            <span className="gold-gradient-text-light">to Find You</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-lg text-[#9B9B9B] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join 500+ Indian startups that have identified and fixed their legal blind spots.
            Your free assessment takes less than 10 minutes.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <Link href="/assessment">
            <motion.span
              className="relative inline-flex items-center gap-2.5 px-10 py-4 text-base font-semibold text-white gold-gradient-bg rounded-xl shadow-[0_4px_30px_rgba(216,160,76,0.3)] hover:shadow-[0_8px_50px_rgba(216,160,76,0.4)] transition-shadow duration-300 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Free Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.span>
          </Link>

          <p className="mt-5 text-xs text-[#6B6B6B]">
            No signup required · Results in 10 minutes · 100% confidential
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
