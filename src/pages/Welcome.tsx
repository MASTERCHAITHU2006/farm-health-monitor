import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Leaf, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroField from "@/assets/hero-field.jpg";

const features = [
  {
    icon: Leaf,
    title: "Instant Diagnosis",
    description: "AI-powered disease identification in seconds",
  },
  {
    icon: Shield,
    title: "Preventive Care",
    description: "Get actionable prevention recommendations",
  },
  {
    icon: Globe,
    title: "Community Alert",
    description: "Stay informed about regional outbreaks",
  },
];

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroField}
            alt="Lush green farm field at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8 safe-area-top safe-area-bottom">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Logo size="lg" />
          </motion.div>

          <div className="flex-1 flex flex-col justify-center mt-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight"
            >
              Protect Your Crops.
              <br />
              <span className="text-accent">Grow Smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-lg text-white/90 max-w-md"
            >
              AI-powered crop disease diagnosis at your fingertips. Identify
              problems early and get expert recommendations instantly.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-3 mt-8"
          >
            <Link to="/auth" className="block">
              <Button variant="hero" size="xl" className="w-full">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth" className="block">
              <Button variant="outline" size="lg" className="w-full border-white/50 text-white hover:bg-white/20 hover:text-white">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
