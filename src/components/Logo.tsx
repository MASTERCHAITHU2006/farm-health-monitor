import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 gradient-hero rounded-full blur-lg opacity-50" />
        <div className="relative gradient-hero p-2 rounded-full">
          <Leaf className="text-primary-foreground" size={sizes[size].icon} />
        </div>
      </div>
      {showText && (
        <span className={`font-heading font-bold ${sizes[size].text} text-foreground`}>
          Farm<span className="text-primary">Sentra</span>
        </span>
      )}
    </motion.div>
  );
}
