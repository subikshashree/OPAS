import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "light" | "dark" | "gradient";
  glowColor?: "blue" | "purple" | "cyan" | "none";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = "default", glowColor = "none", ...props }, ref) => {
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-panel p-6",
          variant === "light" && "glass-panel-light",
          variant === "dark" && "bg-black/8 border-white/15 text-white backdrop-blur-[30px]",
          variant === "gradient" && "bg-gradient-to-br from-white/30 via-white/15 to-transparent border-white/40",
          glowColor === "blue" && "shadow-[var(--shadow-glass-glow-blue),var(--shadow-glass-inset)]",
          glowColor === "purple" && "shadow-[var(--shadow-glass-glow-purple),var(--shadow-glass-inset)]",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      >
        <div className="glass-reflection rounded-3xl" />
        <div className="glass-content">
          {children as React.ReactNode}
        </div>
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
