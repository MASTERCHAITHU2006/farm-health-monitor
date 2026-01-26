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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { crops } from "@/data/crops";
import { findPossibleDiseases } from "@/data/diseases";

export default function DiagnosisResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropId = searchParams.get("crop");
  const symptomsParam = searchParams.get("symptoms") || "";
  const photosCount = parseInt(searchParams.get("photos") || "0");

  const crop = crops.find((c) => c.id === cropId);
  const symptomIds = symptomsParam ? symptomsParam.split(",") : [];

  // Find possible diseases based on crop and symptoms
  const possibleDiseases = cropId ? findPossibleDiseases(cropId, symptomIds) : [];
  const primaryDisease = possibleDiseases[0];

  // Calculate confidence based on symptoms and photo availability
  const baseConfidence = primaryDisease
    ? Math.round((symptomIds.filter((s) => primaryDisease.symptoms.includes(s)).length / primaryDisease.symptoms.length) * 100)
    : 0;
  const photoBonus = photosCount > 0 ? 15 : 0;
  const confidence = Math.min(baseConfidence + photoBonus, 98);

  const severityColors = {
    low: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-destructive text-destructive-foreground",
  };

  if (!crop || !primaryDisease) {
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
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              Diagnosis Results
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="text-lg">{crop.emoji}</span>
              {crop.name}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
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
                  severityColors[primaryDisease.severity]
                }`}
              >
                {primaryDisease.severity === "high" && <AlertTriangle className="w-3 h-3" />}
                {primaryDisease.severity.charAt(0).toUpperCase() +
                  primaryDisease.severity.slice(1)}{" "}
                Severity
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-heading text-primary">
                {confidence}%
              </div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            {primaryDisease.name}
          </h2>
          <p className="text-muted-foreground">{primaryDisease.description}</p>

          {/* Confidence Bar */}
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="h-full gradient-hero rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Matched Symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            Matched Symptoms
          </h3>
          <div className="flex flex-wrap gap-2">
            {symptomIds.map((symptomId) => (
              <span
                key={symptomId}
                className={`px-3 py-1 rounded-full text-sm ${
                  primaryDisease.symptoms.includes(symptomId)
                    ? "bg-success/10 text-success border border-success/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {symptomId.replace(/_/g, " ")}
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
            {primaryDisease.prevention.map((item, index) => (
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
            {primaryDisease.treatment.map((item, index) => (
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

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button variant="default" size="lg" className="w-full">
            <Save className="w-5 h-5" />
            Save Report
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
