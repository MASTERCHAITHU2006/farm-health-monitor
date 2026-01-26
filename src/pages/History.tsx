import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { BottomNav } from "@/components/BottomNav";

// Mock history data
const historyData = [
  {
    id: "1",
    crop: "Tomato",
    disease: "Late Blight",
    date: "Jan 26, 2026",
    severity: "high" as const,
    confidence: 94,
  },
  {
    id: "2",
    crop: "Potato",
    disease: "Powdery Mildew",
    date: "Jan 25, 2026",
    severity: "medium" as const,
    confidence: 87,
  },
  {
    id: "3",
    crop: "Cucumber",
    disease: "Leaf Spot",
    date: "Jan 23, 2026",
    severity: "low" as const,
    confidence: 91,
  },
  {
    id: "4",
    crop: "Tomato",
    disease: "Mosaic Virus",
    date: "Jan 20, 2026",
    severity: "medium" as const,
    confidence: 82,
  },
  {
    id: "5",
    crop: "Pepper",
    disease: "Bacterial Wilt",
    date: "Jan 18, 2026",
    severity: "high" as const,
    confidence: 89,
  },
  {
    id: "6",
    crop: "Grape",
    disease: "Powdery Mildew",
    date: "Jan 15, 2026",
    severity: "low" as const,
    confidence: 95,
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && item.severity === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top bg-card border-b border-border sticky top-0 z-40">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
          Diagnosis History
        </h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by crop or disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {["all", "high", "medium", "low"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? "gradient-hero text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {filter === "all" ? "All" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Severity`}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-foreground">
              No diagnoses found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Start your first diagnosis to see your history"}
            </p>
          </motion.div>
        ) : (
          filteredHistory.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DiagnosisCard {...diagnosis} />
            </motion.div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
