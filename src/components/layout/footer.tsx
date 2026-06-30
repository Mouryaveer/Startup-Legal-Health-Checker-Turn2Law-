import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/seo";

const footerLinks = {
  product: [
    { label: "Legal Health Check", href: "/assessment" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Sample Report", href: "/#sample-report" },
  ],
  company: [
    { label: "About Turn2Law", href: "https://turn2law.com" },
    { label: "Legal Templates", href: "https://templates.turn2law.com" },
    { label: "Contact Us", href: `mailto:${SITE_CONFIG.email}` },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A0A0A] text-white overflow-hidden" role="contentinfo">
      {/* Subtle gold gradient line at top */}
      <div className="h-px w-full gold-gradient-bg opacity-40" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4" aria-label="Turn2Law Home">
              <img
                src="/logo.jpeg"
                alt="Turn2Law Logo"
                className="h-8 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-sm text-[#9B9B9B] leading-relaxed max-w-xs">
              Empowering Indian startups with legal clarity. Know your compliance health, fix gaps, and build on a solid legal foundation.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8A04C] mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9B9B9B] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8A04C] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9B9B9B] hover:text-white transition-colors duration-200"
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D8A04C] mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9B9B9B] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6B6B]">
            © {currentYear} Turn2Law. All rights reserved.
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Made with care for Indian startups
          </p>
        </div>
      </div>
    </footer>
  );
}
