"use client";

import { useEffect, useState } from "react";
import { calculateScores, type AssessmentResult } from "@/lib/assessment/scoring";
import { ResultsClient } from "./results-client";
import { AlertCircle } from "lucide-react";

interface LocalResultsClientProps {
  localId: string;
}

export function LocalResultsClient({ localId }: LocalResultsClientProps) {
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [companyName, setCompanyName] = useState("My Startup");
  const [error, setError] = useState(false);

  useEffect(() => {
    const key = `t2l_local_results_${localId.replace("local-", "")}`;
    const dataStr = localStorage.getItem(key);
    
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.answers && parsed.scores) {
          setResults(parsed.scores);
        } else {
          // If only answers were stored, recompute scores
          const computed = calculateScores(parsed);
          setResults(computed);
        }
        
        const name = localStorage.getItem("t2l_company_name");
        if (name) {
          setCompanyName(name);
        }
      } catch (e) {
        console.error("Failed to parse local assessment results", e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [localId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#0A0A0A]">Assessment Not Found</h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          The requested compliance assessment could not be retrieved. It may have been completed on a different browser, or deleted.
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-[#D8A04C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#6B6B6B] mt-4 font-medium">Recomputing compliance analysis...</p>
      </div>
    );
  }

  return <ResultsClient results={results} companyName={companyName} />;
}
