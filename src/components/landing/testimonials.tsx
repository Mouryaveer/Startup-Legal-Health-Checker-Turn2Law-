"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Co-Founder & CEO",
    company: "FinStack Technologies",
    stage: "Series A",
    quote:
      "The Health Check revealed three critical compliance gaps we had no idea about — including a missing DPDP Act compliance that could have derailed our Series A due diligence. We fixed everything before the investor meeting.",
    score: 42,
    scoreAfter: 87,
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Founder",
    company: "HealthBridge AI",
    stage: "Pre-Seed",
    quote:
      "As a first-time founder, I had no idea where to start with legal compliance. This tool gave me a clear roadmap. The recommendations were specific enough to act on immediately. I went from confused to confident in 10 minutes.",
    score: 28,
    scoreAfter: 79,
    rating: 5,
  },
  {
    name: "Vikram Patel",
    role: "CTO & Co-Founder",
    company: "DataLens Analytics",
    stage: "Seed",
    quote:
      "We thought we were compliant until the assessment scored us 51. Turns out our employment contracts were missing key clauses and we had zero IP assignment documentation. Turn2Law fixed it all within two weeks.",
    score: 51,
    scoreAfter: 91,
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    setCurrentIndex(
      ((index % testimonials.length) + testimonials.length) % testimonials.length
    );
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-[#FEFCF9] relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(216,160,76,0.04)_0%,transparent_50%)]" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8E5F28] bg-[#FDF8EF] rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight mb-4">
              Founders Who Took Action
            </h2>
          </div>
        </ScrollReveal>

        <div ref={containerRef} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-8 sm:p-10 lg:p-12 rounded-3xl bg-white border border-[#E8E1D5] shadow-[0_4px_20px_rgba(10,10,10,0.04)]"
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-6 right-6 w-10 h-10 text-[#D8A04C]/10"
                aria-hidden="true"
              />

              {/* Rating */}
              <div className="flex gap-1 mb-6" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < testimonial.rating ? "#D8A04C" : "none"}
                    stroke={i < testimonial.rating ? "#D8A04C" : "#E8E1D5"}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-xl text-[#3D3D3D] leading-relaxed mb-8 font-medium">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author + Score */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-[#0A0A0A]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#6B6B6B]">
                    {testimonial.role}, {testimonial.company}
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-[#D8A04C] bg-[#FDF8EF] rounded-full border border-[#E8D5B0]">
                    {testimonial.stage}
                  </span>
                </div>

                {/* Score change */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FEFCF9] border border-[#E8E1D5]">
                  <div className="text-center">
                    <div className="text-xs text-[#9B9B9B] mb-0.5">Before</div>
                    <div className="text-lg font-bold text-[#DC2626]">{testimonial.score}</div>
                  </div>
                  <div className="w-8 h-px bg-[#E8E1D5] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full gold-gradient-bg" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#9B9B9B] mb-0.5">After</div>
                    <div className="text-lg font-bold text-[#16A34A]">{testimonial.scoreAfter}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="p-2 rounded-full border border-[#E8E1D5] hover:border-[#D8A04C]/40 hover:bg-[#FDF8EF] transition-all duration-200 focus-ring-gold"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-[#6B6B6B]" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-8 gold-gradient-bg"
                      : "w-2 bg-[#E8E1D5] hover:bg-[#D8A04C]/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(currentIndex + 1)}
              className="p-2 rounded-full border border-[#E8E1D5] hover:border-[#D8A04C]/40 hover:bg-[#FDF8EF] transition-all duration-200 focus-ring-gold"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
