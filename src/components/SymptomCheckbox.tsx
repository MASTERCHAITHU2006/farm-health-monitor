import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SymptomCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

export function SymptomCheckbox({
  id,
  label,
  description,
  checked,
  onChange,
}: SymptomCheckboxProps) {
  return (
    <motion.button
      onClick={onChange}
      whileTap={{ scale: 0.98 }}
      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all w-full ${
        checked
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? "gradient-hero border-transparent"
            : "border-muted-foreground/30 bg-transparent"
        }`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}
      </div>
      <div className="flex-1">
        <span className="font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </motion.button>
  );
}
