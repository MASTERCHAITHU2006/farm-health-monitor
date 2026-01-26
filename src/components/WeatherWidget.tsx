import { Cloud, Sun, Droplets, Wind } from "lucide-react";
import { motion } from "framer-motion";

export function WeatherWidget() {
  // Mock weather data - in production, this would come from an API
  const weather = {
    temp: 28,
    condition: "Sunny",
    humidity: 65,
    wind: 12,
    location: "Your Farm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="gradient-hero rounded-2xl p-4 text-primary-foreground shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{weather.location}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold font-heading">{weather.temp}</span>
            <span className="text-xl">°C</span>
          </div>
          <p className="text-sm font-medium mt-1">{weather.condition}</p>
        </div>
        <Sun className="w-16 h-16 opacity-90" />
      </div>
      
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 opacity-80" />
          <span className="text-sm">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 opacity-80" />
          <span className="text-sm">{weather.wind} km/h</span>
        </div>
      </div>
    </motion.div>
  );
}
