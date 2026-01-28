import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Shield,
  Pill,
  Share2,
  Save,
  Home,
  RotateCcw,
  Sparkles,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { crops } from "@/data/crops";
import { findPossibleDiseases } from "@/data/diseases";
import { DiagnosisResult } from "@/hooks/useDiseaseAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function DiagnosisResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropId = searchParams.get("crop");
  const symptomsParam = searchParams.get("symptoms") || "";
  const isAiDiagnosis = searchParams.get("ai") === "true";
  const photosCount = parseInt(searchParams.get("photos") || "0");

  const crop = crops.find((c) => c.id === cropId);
  const symptomIds = symptomsParam ? symptomsParam.split(",") : [];
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [aiResult, setAiResult] = useState<DiagnosisResult | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load AI result from sessionStorage
  useEffect(() => {
    if (isAiDiagnosis) {
      const storedResult = sessionStorage.getItem("diagnosisResult");
      const storedPhoto = sessionStorage.getItem("diagnosisPhoto");
      if (storedResult) {
        try {
          setAiResult(JSON.parse(storedResult));
        } catch (e) {
          console.error("Failed to parse AI result:", e);
        }
      }
      if (storedPhoto) {
        setPhotoUrl(storedPhoto);
      }
    }
  }, [isAiDiagnosis]);

  // Fallback to rule-based diagnosis if no AI result
  const possibleDiseases = cropId ? findPossibleDiseases(cropId, symptomIds) : [];
  const ruleBasedDisease = possibleDiseases[0];

  // Use AI result or fallback to rule-based
  const diagnosis = aiResult || (ruleBasedDisease ? {
    diseaseName: ruleBasedDisease.name,
    confidence: Math.round((symptomIds.filter((s) => ruleBasedDisease.symptoms.includes(s)).length / ruleBasedDisease.symptoms.length) * 100) + (photosCount > 0 ? 15 : 0),
    severity: ruleBasedDisease.severity as "low" | "medium" | "high",
    description: ruleBasedDisease.description,
    symptoms: ruleBasedDisease.symptoms,
    prevention: ruleBasedDisease.prevention,
    treatment: ruleBasedDisease.treatment,
  } : null);

  const severityColors = {
    low: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-destructive text-destructive-foreground",
  };

  const handleSaveReport = async () => {
    if (!user || !diagnosis || !crop) {
      toast({
        variant: "destructive",
        title: "Unable to save",
        description: user ? "Missing diagnosis data" : "Please sign in to save reports",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("diagnoses").insert({
        user_id: user.id,
        crop_id: cropId!,
        crop_name: crop.name,
        symptoms: symptomIds,
        disease_name: diagnosis.diseaseName,
        disease_id: ruleBasedDisease?.id || null,
        confidence: Math.min(diagnosis.confidence, 100),
        severity: diagnosis.severity,
        prevention_measures: diagnosis.prevention,
        treatment_recommendations: diagnosis.treatment,
        notes: diagnosis.additionalNotes || diagnosis.description,
        photo_url: photoUrl || null,
        status: "completed",
      });

      if (error) throw error;

      toast({
        title: "Report Saved!",
        description: "Your diagnosis has been saved to your history.",
      });
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the report. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!crop || !diagnosis) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4"
        >
          <AlertTriangle className="w-10 h-10 text-muted-foreground" />
        </motion.div>
        <h2 className="text-xl font-heading font-bold text-foreground text-center">
          Unable to Identify Disease
        </h2>
        <p className="text-muted-foreground text-center mt-2 max-w-sm">
          We couldn't find a matching disease. Please try again with more symptoms
          or clearer photos.
        </p>
        <Button onClick={() => navigate("/diagnosis/crop")} className="mt-6">
          <RotateCcw className="w-5 h-5" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-heading font-bold text-foreground">
              Diagnosis Results
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="text-lg">{crop.emoji}</span>
              {crop.name}
            </p>
          </div>
          {isAiDiagnosis && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI</span>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* AI Badge */}
        {isAiDiagnosis && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-primary"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI vision analysis</span>
          </motion.div>
        )}

        {/* Disease Identification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  severityColors[diagnosis.severity]
                }`}
              >
                {diagnosis.severity === "high" && <AlertTriangle className="w-3 h-3" />}
                {diagnosis.severity.charAt(0).toUpperCase() +
                  diagnosis.severity.slice(1)}{" "}
                Severity
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-heading text-primary">
                {Math.min(diagnosis.confidence, 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            {diagnosis.diseaseName}
          </h2>
          <p className="text-muted-foreground">{diagnosis.description}</p>

          {/* Confidence Bar */}
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(diagnosis.confidence, 100)}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="h-full gradient-hero rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Photo Preview (if available) */}
        {photoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <img 
              src={photoUrl} 
              alt="Analyzed crop" 
              className="w-full h-48 object-cover"
            />
          </motion.div>
        )}

        {/* Matched Symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            {isAiDiagnosis ? "Identified Symptoms" : "Matched Symptoms"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(isAiDiagnosis ? diagnosis.symptoms : symptomIds).map((symptom, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-success/10 text-success border border-success/30"
              >
                {symptom.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Prevention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            Prevention Measures
          </h3>
          <ul className="space-y-2">
            {diagnosis.prevention.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-foreground font-bold">
                    {index + 1}
                  </span>
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Treatment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-secondary" />
            Treatment Recommendations
          </h3>
          <ul className="space-y-2">
            {diagnosis.treatment.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full gradient-earth flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-secondary-foreground font-bold">
                    {index + 1}
                  </span>
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Additional Notes (AI only) */}
        {isAiDiagnosis && diagnosis.additionalNotes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-muted rounded-xl p-4"
          >
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Notes
            </h3>
            <p className="text-sm text-muted-foreground">{diagnosis.additionalNotes}</p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={handleSaveReport}
            disabled={isSaving || !user}
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Saving..." : user ? "Save Report" : "Sign in to Save"}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/diagnosis/crop")}
            >
              <RotateCcw className="w-5 h-5" />
              New Diagnosis
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
