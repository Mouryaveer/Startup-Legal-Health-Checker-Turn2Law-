import { HeroSection } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { BenefitsSection } from "@/components/landing/benefits";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { generateFAQSchema } from "@/lib/constants/seo";

const faqData = [
  { question: "Is the Legal Health Check really free?", answer: "Yes, completely free with no hidden costs. We built this tool to help Indian startup founders identify legal risks early." },
  { question: "How long does the assessment take?", answer: "The assessment typically takes 8–12 minutes to complete, covering 7 legal categories with targeted questions." },
  { question: "Is my data confidential?", answer: "Absolutely. Your assessment data is encrypted in transit and at rest. We never share individual assessment details with third parties." },
  { question: "What legal areas does the assessment cover?", answer: "Company Formation, Founder Agreements, Employment & HR, Intellectual Property, Contracts, Data Privacy, and Regulatory Compliance." },
  { question: "What happens after I get my score?", answer: "You'll receive a detailed report with your overall score, category-wise breakdown, risk matrix, and prioritized recommendations." },
  { question: "Do I need to create an account?", answer: "No account creation is required. We only ask for your company name and email at the end to send you the detailed report." },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqData)),
        }}
      />
      <HeroSection />
      <ProblemSection />
      <StatsSection />
      <BenefitsSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
