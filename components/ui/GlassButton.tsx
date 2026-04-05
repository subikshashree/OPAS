import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
          variant === "primary" && "glass-button-primary",
          variant === "secondary" && "glass-button text-slate-800",
          variant === "ghost" && "bg-transparent hover:bg-white/20 text-slate-700",
          variant === "icon" && "glass-button aspect-square p-0 rounded-full",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6",
          size === "lg" && "h-14 px-8 text-lg",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
GlassButton.displayName = "GlassButton";
