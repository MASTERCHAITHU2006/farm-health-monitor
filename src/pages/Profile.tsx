import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Leaf,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Link } from "react-router-dom";

const profileSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", href: "/profile/edit" },
      { icon: Leaf, label: "My Crops", href: "/profile/crops" },
      { icon: Bell, label: "Notifications", href: "/profile/notifications" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Settings, label: "App Settings", href: "/settings" },
      { icon: Shield, label: "Privacy & Security", href: "/profile/privacy" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Tutorials", href: "/help" },
      { icon: Mail, label: "Contact Support", href: "/support" },
    ],
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-4 pt-12 pb-8 safe-area-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl border-4 border-white/30">
            👨‍🌾
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary-foreground mt-4">
            John Farmer
          </h1>
          <div className="flex items-center gap-1 text-primary-foreground/80 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Central Valley, California</span>
          </div>

          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">12</div>
              <div className="text-xs text-primary-foreground/70">Diagnoses</div>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">5</div>
              <div className="text-xs text-primary-foreground/70">Crops</div>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">2</div>
              <div className="text-xs text-primary-foreground/70">Alerts</div>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {profileSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground"
        >
          FarmSentra v1.0.0
        </motion.p>
      </main>

      <BottomNav />
    </div>
  );
}
