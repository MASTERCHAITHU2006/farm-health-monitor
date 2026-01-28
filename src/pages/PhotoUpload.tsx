import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoUploader } from "@/components/PhotoUploader";
import { ProgressSteps } from "@/components/ProgressSteps";
import { BottomNav } from "@/components/BottomNav";
import { crops } from "@/data/crops";
import { useDiseaseAnalysis } from "@/hooks/useDiseaseAnalysis";

export default function PhotoUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cropId = searchParams.get("crop");
  const symptomsParam = searchParams.get("symptoms");
  const crop = crops.find((c) => c.id === cropId);

  const [photos, setPhotos] = useState<string[]>([]);
  const { analyzeDisease, isAnalyzing } = useDiseaseAnalysis();

  const handleAnalyze = async () => {
    if (!crop) return;

    const symptoms = symptomsParam ? symptomsParam.split(",") : [];
    
    // Use the first photo for analysis (or null if no photos)
    const imageBase64 = photos.length > 0 ? photos[0] : null;
    
    const result = await analyzeDisease(imageBase64, crop.name, symptoms);
    
    if (result) {
      // Store result in sessionStorage for the results page
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result));
      sessionStorage.setItem("diagnosisPhoto", imageBase64 || "");
      navigate(`/diagnosis/results?crop=${cropId}&symptoms=${symptomsParam}&ai=true`);
    }
  };

  const handleSkip = () => {
    // Clear any previous AI result
    sessionStorage.removeItem("diagnosisResult");
    sessionStorage.removeItem("diagnosisPhoto");
    navigate(`/diagnosis/results?crop=${cropId}&symptoms=${symptomsParam}&photos=0`);
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
              Upload Photos
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="text-lg">{crop.emoji}</span>
              {crop.name} diagnosis
            </p>
          </div>
        </div>

        <ProgressSteps
          currentStep={3}
          totalSteps={3}
          labels={["Crop", "Symptoms", "Photo"]}
        />
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* AI Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-xl p-4 flex items-start gap-3 text-primary-foreground"
        >
          <Sparkles className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">AI-Powered Analysis</h3>
            <p className="text-sm opacity-90 mt-1">
              Our AI can analyze your photos to identify diseases with high accuracy.
              Take clear, close-up photos of affected areas.
            </p>
          </div>
        </motion.div>

        {/* Photo Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PhotoUploader photos={photos} onPhotosChange={setPhotos} />
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-muted rounded-xl p-4"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-primary" />
            Photo Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Take close-up photos of affected leaves or fruits
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Ensure good lighting - natural daylight works best
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include multiple angles for better accuracy
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Keep the camera steady and in focus
            </li>
          </ul>
        </motion.div>

        {/* No Photo Warning */}
        {photos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-foreground">
              Without photos, the diagnosis will be based only on reported symptoms,
              which may be less accurate.
            </p>
          </motion.div>
        )}
      </main>

      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h2 className="text-xl font-heading font-bold text-foreground">
            Analyzing...
          </h2>
          <p className="text-muted-foreground mt-2 text-center px-8">
            AI is examining your {photos.length > 0 ? "photos" : "symptoms"} to identify the disease
          </p>
        </motion.div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1" disabled={isAnalyzing}>
            Skip Photos
          </Button>
          <Button
            onClick={handleAnalyze}
            className="flex-1"
            disabled={isAnalyzing}
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
