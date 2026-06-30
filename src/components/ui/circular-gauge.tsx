"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#16A34A"; // Healthy green
  if (score >= 60) return "#65A30D"; // Low risk lime
  if (score >= 40) return "#D97706"; // Medium amber
  if (score >= 20) return "#EA580C"; // High risk orange
  return "#DC2626"; // Critical red
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Low Risk";
  if (score >= 40) return "Medium Risk";
  if (score >= 20) return "High Risk";
  return "Critical";
}

export function CircularGauge({
  score,
  size = 200,
  strokeWidth = 12,
  className,
  label,
  animate = true,
}: CircularGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayScore, setDisplayScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreColor = getScoreColor(score);
  const scoreLabel = label || getScoreLabel(score);

  useEffect(() => {
    if (!animate || !isInView) return;

    const startTime = performance.now();
    const duration = 1800;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Ease-out quart
      setDisplayScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [score, animate, isInView]);

  const dashOffset = circumference - (circumference * (animate ? displayScore : score)) / 100;

  return (
    <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        role="img"
        aria-label={`Legal health score: ${score} out of 100. ${scoreLabel}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F5F1EB"
          strokeWidth={strokeWidth}
        />

        {/* Score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-100 ease-out"
        />

        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={0.15}
          className="blur-[3px]"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl sm:text-5xl font-bold tabular-nums"
          style={{ color: scoreColor }}
        >
          {animate ? displayScore : score}
        </span>
        <span className="text-xs font-medium text-[#6B6B6B] mt-1">
          out of 100
        </span>
        <span
          className="text-sm font-semibold mt-2 px-3 py-0.5 rounded-full"
          style={{
            color: scoreColor,
            backgroundColor: `${scoreColor}15`,
          }}
        >
          {scoreLabel}
        </span>
      </div>
    </div>
  );
}
