import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CropCardProps {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}

export function CropCard({ id, name, emoji, selected, onClick }: CropCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-primary bg-primary/10 shadow-glow"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 gradient-hero rounded-full flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
      <span className="text-4xl mb-2">{emoji}</span>
      <span className="text-sm font-medium text-foreground text-center">
        {name}
      </span>
    </motion.button>
  );
}
