"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is the Legal Health Check really free?",
    answer:
      "Yes, completely free with no hidden costs. We built this tool to help Indian startup founders identify legal risks early. You'll get your full score, category breakdown, and recommendations at no charge.",
  },
  {
    question: "How long does the assessment take?",
    answer:
      "The assessment typically takes 8–12 minutes to complete. It covers 7 legal categories with targeted questions. You can save your progress and return later if needed.",
  },
  {
    question: "Is my data confidential?",
    answer:
      "Absolutely. Your assessment data is encrypted in transit and at rest. We never share individual assessment details with third parties. Your data is used solely to generate your report and, if you opt in, to connect you with our legal team.",
  },
  {
    question: "What legal areas does the assessment cover?",
    answer:
      "The assessment covers 7 critical areas: Company Formation & Registration, Founder Agreements, Employment & HR Compliance, Intellectual Property, Contracts & Commercial, Data Privacy & IT Law, and Regulatory Compliance.",
  },
  {
    question: "What happens after I get my score?",
    answer:
      "You'll receive a detailed report with your overall score, category-wise breakdown, a risk matrix, and prioritized recommendations. You can download the report as a PDF and optionally book a consultation with Turn2Law's legal experts for remediation.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account creation is required. We only ask for your company name and email at the end so we can send you the detailed report. Your email is never shared or used for unsolicited marketing.",
  },
  {
    question: "Can I retake the assessment later?",
    answer:
      "Yes! We recommend retaking the assessment every quarter or after making significant legal changes. This helps you track your compliance improvement over time.",
  },
  {
    question: "Who built this tool?",
    answer:
      "The Legal Health Check was built by Turn2Law, a legal technology company specializing in startup legal services across India. Our assessment questions are drafted and reviewed by practicing lawyers with startup expertise.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-white" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#8E5F28] bg-[#FDF8EF] rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3" role="region" aria-label="Frequently asked questions">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div
                  className={`rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#D8A04C]/30 bg-[#FEFCF9] shadow-[0_4px_20px_rgba(216,160,76,0.06)]"
                      : "border-[#E8E1D5] bg-white hover:border-[#D8A04C]/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left focus-ring-gold rounded-xl"
                    aria-expanded={isOpen}
                    id={`faq-trigger-${index}`}
                    aria-controls={`faq-content-${index}`}
                  >
                    <span className="text-sm sm:text-base font-medium text-[#0A0A0A] pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-[#9B9B9B]" aria-hidden="true" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-content-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-[#6B6B6B] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
