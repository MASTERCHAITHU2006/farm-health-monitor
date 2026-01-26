import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressSteps({ currentStep, totalSteps, labels }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  isCompleted
                    ? "gradient-hero text-primary-foreground"
                    : isCurrent
                    ? "border-2 border-primary text-primary bg-primary/10"
                    : "border-2 border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </motion.div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isCurrent ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {labels[index]}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                  isCompleted ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
