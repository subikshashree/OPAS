import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface GlassTabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({ tabs, activeId, onChange, className }) => {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-2xl bg-white/20 p-1 backdrop-blur-md border border-white/30", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium transition-colors rounded-xl outline-none",
            activeId === tab.id ? "text-indigo-700" : "text-slate-600 hover:text-slate-900"
          )}
        >
          {activeId === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white/60 shadow-sm rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
