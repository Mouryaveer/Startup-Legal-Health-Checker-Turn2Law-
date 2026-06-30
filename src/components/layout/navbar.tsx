"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const spotlightY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  return (
    <motion.header
      ref={navRef}
      onMouseMove={handleMouseMove}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "py-2"
          : "py-4"
      )}
    >
      {/* Navbar container */}
      <nav
        className={cn(
          "relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 transition-all duration-500",
          isScrolled && "mx-4 sm:mx-6 lg:mx-auto"
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-between h-14 px-6 rounded-2xl transition-all duration-500 overflow-hidden",
            isScrolled
              ? "glass-panel-strong shadow-[0_2px_20px_rgba(10,10,10,0.06)]"
              : "bg-transparent"
          )}
        >
          {/* Mouse spotlight effect (visible when scrolled) */}
          {isScrolled && (
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(300px circle at ${spotlightX}px ${spotlightY}px, rgba(216, 160, 76, 0.06), transparent 60%)`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center group"
            aria-label="Turn2Law Home"
          >
            <img
              src="/logo.jpeg"
              alt="Turn2Law Logo"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-200 rounded-lg hover:bg-[#F5F1EB]/60"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/assessment"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl gold-gradient-bg hover:shadow-[0_4px_20px_rgba(216,160,76,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-ring-gold"
            >
              Start Assessment
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#6B6B6B] hover:text-[#0A0A0A] rounded-lg hover:bg-[#F5F1EB]/60 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden overflow-hidden mt-2"
        >
          <div className="glass-panel-strong rounded-2xl p-4 space-y-1 shadow-lg" role="navigation" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#3D3D3D] hover:text-[#D8A04C] hover:bg-[#FDF8EF] rounded-xl transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#E8E1D5]">
              <Link
                href="/assessment"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white gold-gradient-bg rounded-xl"
              >
                Start Assessment
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}
