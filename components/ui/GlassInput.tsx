import React from "react";
import { cn } from "../../lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-4 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "glass-input",
            icon && "!pl-12",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
