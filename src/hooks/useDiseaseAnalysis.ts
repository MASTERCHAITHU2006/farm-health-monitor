import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DiagnosisResult {
  diseaseName: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  additionalNotes?: string;
}

export function useDiseaseAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeDisease = async (
    imageBase64: string | null,
    cropName: string,
    symptoms: string[]
  ): Promise<DiagnosisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-disease", {
        body: {
          imageBase64: imageBase64 || "",
          cropName,
          symptoms,
        },
      });

      if (fnError) {
        console.error("Function error:", fnError);
        throw new Error(fnError.message || "Analysis failed");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze disease";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeDisease,
    isAnalyzing,
    result,
    error,
  };
}
