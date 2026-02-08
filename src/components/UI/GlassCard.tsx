"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({ 
  children, 
  className,
  hover = true 
}: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.01, backgroundColor: "rgba(255,255,255,0.06)" } : {}}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        "backdrop-blur-xl transition-all duration-300",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
