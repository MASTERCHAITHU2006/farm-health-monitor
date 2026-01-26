import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SymptomCheckbox } from "@/components/SymptomCheckbox";
import { ProgressSteps } from "@/components/ProgressSteps";
import { BottomNav } from "@/components/BottomNav";
import { symptoms, symptomCategories } from "@/data/symptoms";
import { crops } from "@/data/crops";

export default function SymptomSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropId = searchParams.get("crop");
  const crop = crops.find((c) => c.id === cropId);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string>("Leaves");

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleContinue = () => {
    const symptomsParam = selectedSymptoms.join(",");
    navigate(`/diagnosis/photo?crop=${cropId}&symptoms=${symptomsParam}`);
  };

  const handleSkip = () => {
    navigate(`/diagnosis/photo?crop=${cropId}&symptoms=`);
  };

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid crop selection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              Report Symptoms
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="text-lg">{crop.emoji}</span>
              {crop.name} selected
            </p>
          </div>
        </div>

        <ProgressSteps
          currentStep={2}
          totalSteps={3}
          labels={["Crop", "Symptoms", "Photo"]}
        />
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Select all symptoms you've observed on your {crop.name.toLowerCase()}. 
            The more symptoms you report, the more accurate the diagnosis.
          </p>
        </motion.div>

        {/* Symptom Categories */}
        {symptomCategories.map((category, catIndex) => {
          const categorySymptoms = symptoms.filter((s) => s.category === category);
          const isExpanded = expandedCategory === category;
          const selectedCount = categorySymptoms.filter((s) =>
            selectedSymptoms.includes(s.id)
          ).length;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? "" : category)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-heading font-semibold text-foreground">
                    {category}
                  </span>
                  {selectedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {selectedCount} selected
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 space-y-2"
                >
                  {categorySymptoms.map((symptom) => (
                    <SymptomCheckbox
                      key={symptom.id}
                      {...symptom}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onChange={() => toggleSymptom(symptom.id)}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        {selectedSymptoms.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
