"use client";

import { useState } from "react";
import type { RiskItem } from "@/lib/assessment/scoring";
import { cn } from "@/lib/utils";
import { Info, HelpCircle } from "lucide-react";

interface RiskMatrixProps {
  risks: RiskItem[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

  // Group risks by Likelihood / Impact coordinates
  // Critical -> High Likelihood (4), High Impact (4)
  // High -> Medium Likelihood (3), High Impact (4)
  // Medium -> Medium Likelihood (3), Medium Impact (3)
  // Low -> Low Likelihood (2), Low Impact (2)
  const getCoordinates = (risk: RiskItem) => {
    switch (risk.riskLevel) {
      case "critical":
        return { x: 3, y: 3 }; // Top right (0-indexed 3,3 is grid quadrant)
      case "high":
        return { x: 2, y: 3 };
      case "medium":
        return { x: 2, y: 2 };
      default:
        return { x: 1, y: 1 };
    }
  };

  const gridCells = [
    { row: 3, col: 0, color: "bg-amber-100/50 hover:bg-amber-200/50 border-amber-200", label: "Medium" },
    { row: 3, col: 1, color: "bg-orange-100/50 hover:bg-orange-200/50 border-orange-200", label: "High" },
    { row: 3, col: 2, color: "bg-red-100/50 hover:bg-red-200/50 border-red-200", label: "Critical" },
    { row: 3, col: 3, color: "bg-red-200 hover:bg-red-300 border-red-300", label: "Severe" },

    { row: 2, col: 0, color: "bg-yellow-100/50 hover:bg-yellow-200/50 border-yellow-200", label: "Medium" },
    { row: 2, col: 1, color: "bg-amber-100/50 hover:bg-amber-200/50 border-amber-200", label: "Medium" },
    { row: 2, col: 2, color: "bg-orange-100/50 hover:bg-orange-200/50 border-orange-200", label: "High" },
    { row: 2, col: 3, color: "bg-red-100/50 hover:bg-red-200/50 border-red-200", label: "Critical" },

    { row: 1, col: 0, color: "bg-green-100/50 hover:bg-green-200/50 border-green-200", label: "Low" },
    { row: 1, col: 1, color: "bg-yellow-100/50 hover:bg-yellow-200/50 border-yellow-200", label: "Medium" },
    { row: 1, col: 2, color: "bg-amber-100/50 hover:bg-amber-200/50 border-amber-200", label: "Medium" },
    { row: 1, col: 3, color: "bg-orange-100/50 hover:bg-orange-200/50 border-orange-200", label: "High" },

    { row: 0, col: 0, color: "bg-green-200 hover:bg-green-300 border-green-300", label: "Negligible" },
    { row: 0, col: 1, color: "bg-green-100/50 hover:bg-green-200/50 border-green-200", label: "Low" },
    { row: 0, col: 2, color: "bg-yellow-100/50 hover:bg-yellow-200/50 border-yellow-200", label: "Medium" },
    { row: 0, col: 3, color: "bg-amber-100/50 hover:bg-amber-200/50 border-amber-200", label: "Medium" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
      {/* Visual Matrix Map */}
      <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0A]">Risk Severity Matrix</h3>
          <p className="text-[11px] text-[#6B6B6B] mb-6">Distribution mapping likelihood against business impact.</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative flex flex-col items-center">
            {/* Y Axis Label */}
            <div className="absolute -left-12 top-1/2 -rotate-90 transform origin-center text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
              Impact Severity →
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-4 gap-1.5 w-64 h-64 sm:w-80 sm:h-80 border-l border-b border-[#BFBFBF] pl-2 pb-2 relative">
              {gridCells.map((cell, idx) => {
                // Find risks that fall into this grid cell coordinates
                const cellRisks = risks.filter((r) => {
                  const coords = getCoordinates(r);
                  return coords.x === cell.col && coords.y === cell.row;
                });

                return (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg border flex flex-wrap gap-1 p-1 items-center justify-center relative transition-all duration-300 min-h-0 min-w-0 cursor-pointer overflow-hidden",
                      cell.color
                    )}
                  >
                    {cellRisks.map((risk) => (
                      <button
                        key={risk.questionId}
                        onClick={() => setSelectedRisk(risk)}
                        className={cn(
                          "w-3 h-3 rounded-full shrink-0 animate-pulse transition-transform duration-300 hover:scale-150 border border-white shadow-sm",
                          risk.riskLevel === "critical" ? "bg-red-700" :
                          risk.riskLevel === "high" ? "bg-orange-600" :
                          risk.riskLevel === "medium" ? "bg-amber-600" : "bg-lime-600"
                        )}
                        title={risk.questionText}
                      />
                    ))}
                    {cellRisks.length === 0 && (
                      <span className="opacity-0 group-hover:opacity-40 text-[9px] text-gray-500 pointer-events-none select-none">
                        {cell.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X Axis Label */}
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mt-4">
              Likelihood Probability →
            </div>
          </div>
        </div>
      </div>

      {/* Selected Risk Details Panel */}
      <div className="lg:col-span-1 glass-panel-strong rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0A] mb-1">Risk Inspector</h3>
          <p className="text-[11px] text-[#6B6B6B] mb-5">Click a dot on the matrix grid to inspect risk detail.</p>
        </div>

        {selectedRisk ? (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className={cn(
                "inline-block px-2.5 py-0.5 rounded-full border text-[10px] capitalize font-bold",
                selectedRisk.riskLevel === "critical" ? "bg-red-50 text-red-700 border-red-200" :
                selectedRisk.riskLevel === "high" ? "bg-orange-50 text-orange-700 border-orange-200" :
                selectedRisk.riskLevel === "medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-green-50 text-green-700 border-green-200"
              )}>
                {selectedRisk.riskLevel} Severity
              </span>
              <h4 className="text-sm font-bold text-[#0A0A0A] leading-snug">
                {selectedRisk.title}
              </h4>
              <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                <strong>Why it matters:</strong> {selectedRisk.whyItMatters}
              </p>
              <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                <strong>Next step:</strong> {selectedRisk.nextStep}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#6B6B6B]">
              <span>Resolution effort:</span>
              <span className="font-bold uppercase text-[#0A0A0A]">{selectedRisk.estimatedEffort}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EF] border border-[#E8D5B0] flex items-center justify-center text-[#D8A04C]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-[200px]">
              No risk selected. Hover or tap the glowing dots inside the matrix map to examine details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
