import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const GlassToggle: React.FC<GlassToggleProps> = ({ checked, onChange, className, size = "md" }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        checked ? "bg-indigo-500/80 border-indigo-400/50 shadow-[var(--shadow-glass-glow-purple)]" : "glass-button",
        size === "sm" && "h-5 w-9",
        size === "md" && "h-7 w-12",
        size === "lg" && "h-9 w-16",
        className
      )}
    >
      <span className="sr-only">Toggle</span>
      <motion.span
        layout
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow-lg transform transition duration-200 ease-in-out",
          checked ? (size === "sm" ? "translate-x-4" : size === "md" ? "translate-x-5" : "translate-x-7") : "translate-x-0"
        )}
        style={{
          width: size === "sm" ? "16px" : size === "md" ? "24px" : "32px",
          height: size === "sm" ? "16px" : size === "md" ? "24px" : "32px",
        }}
      />
    </button>
  );
};
