import { ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface DiagnosisCardProps {
  id: string;
  crop: string;
  disease: string;
  date: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  thumbnail?: string;
}

export function DiagnosisCard({
  id,
  crop,
  disease,
  date,
  severity,
  confidence,
  thumbnail,
}: DiagnosisCardProps) {
  const severityColors = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const severityIcons = {
    low: CheckCircle,
    medium: AlertTriangle,
    high: AlertTriangle,
  };

  const SeverityIcon = severityIcons[severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/history/${id}`}
        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={crop}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              🌱
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground truncate">
            {disease}
          </h3>
          <p className="text-sm text-muted-foreground">{crop}</p>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${severityColors[severity]}`}
            >
              <SeverityIcon className="w-3 h-3" />
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold text-primary">
            {confidence}%
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Link>
    </motion.div>
  );
}
