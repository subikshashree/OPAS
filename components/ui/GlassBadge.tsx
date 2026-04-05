import React from "react";
import { cn } from "../../lib/utils";

export interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export const GlassBadge = React.forwardRef<HTMLDivElement, GlassBadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md transition-colors",
          variant === "default" && "bg-white/20 border-white/30 text-slate-800",
          variant === "success" && "bg-emerald-500/20 border-emerald-500/30 text-emerald-800",
          variant === "warning" && "bg-amber-500/20 border-amber-500/30 text-amber-800",
          variant === "danger" && "bg-rose-500/20 border-rose-500/30 text-rose-800",
          variant === "info" && "bg-blue-500/20 border-blue-500/30 text-blue-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassBadge.displayName = "GlassBadge";
