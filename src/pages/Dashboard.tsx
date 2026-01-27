import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { WeatherWidget } from "@/components/WeatherWidget";
import { DiagnosisCard } from "@/components/DiagnosisCard";
import { BottomNav } from "@/components/BottomNav";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Stethoscope, AlertTriangle, TrendingUp, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data
const recentDiagnoses = [
  {
    id: "1",
    crop: "Tomato",
    disease: "Late Blight",
    date: "2 hours ago",
    severity: "high" as const,
    confidence: 94,
  },
  {
    id: "2",
    crop: "Potato",
    disease: "Powdery Mildew",
    date: "Yesterday",
    severity: "medium" as const,
    confidence: 87,
  },
  {
    id: "3",
    crop: "Cucumber",
    disease: "Leaf Spot",
    date: "3 days ago",
    severity: "low" as const,
    confidence: 91,
  },
];

const stats = [
  { label: "Diagnoses", value: "12", icon: Stethoscope },
  { label: "Crops", value: "5", icon: Leaf },
  { label: "Alerts", value: "2", icon: AlertTriangle },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <Leaf className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Farmer';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 safe-area-top">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold">{userInitials}</span>
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Good Morning, <span className="text-primary">{userName}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Your crops are looking healthy today
          </p>
        </motion.div>
      </header>

      <main className="px-4 space-y-6">
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border shadow-sm text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold font-heading text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* New Diagnosis CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/diagnosis/crop">
            <Button
              size="xl"
              className="w-full animate-pulse-glow"
            >
              <Stethoscope className="w-6 h-6" />
              New Diagnosis
            </Button>
          </Link>
        </motion.div>

        {/* Regional Alert Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">Regional Alert</h3>
            <p className="text-sm text-muted-foreground">
              Late Blight outbreak reported in your area. Monitor your tomato and
              potato crops closely.
            </p>
          </div>
        </motion.div>

        {/* Recent Diagnoses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Recent Diagnoses
            </h2>
            <Link
              to="/history"
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              View All
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDiagnoses.map((diagnosis, index) => (
              <motion.div
                key={diagnosis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <DiagnosisCard {...diagnosis} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  );
}
