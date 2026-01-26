import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CropCard } from "@/components/CropCard";
import { ProgressSteps } from "@/components/ProgressSteps";
import { BottomNav } from "@/components/BottomNav";
import { crops, cropCategories } from "@/data/crops";

export default function CropSelection() {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCrops = useMemo(() => {
    let result = crops;

    if (searchQuery) {
      result = result.filter((crop) =>
        crop.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((crop) => crop.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const handleContinue = () => {
    if (selectedCrop) {
      navigate(`/diagnosis/symptoms?crop=${selectedCrop}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              Select Your Crop
            </h1>
            <p className="text-sm text-muted-foreground">
              Step 1: What crop needs diagnosis?
            </p>
          </div>
        </div>

        <ProgressSteps
          currentStep={1}
          totalSteps={3}
          labels={["Crop", "Symptoms", "Photo"]}
        />
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search crops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              !selectedCategory
                ? "gradient-hero text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          {cropCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "gradient-hero text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Crop Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.03 }}
            >
              <CropCard
                {...crop}
                selected={selectedCrop === crop.id}
                onClick={() => setSelectedCrop(crop.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No crops found</p>
          </div>
        )}
      </main>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={handleContinue}
          disabled={!selectedCrop}
          size="lg"
          className="w-full"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
