import React from 'react';
import { GlassButton } from './GlassButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Professional empty state component for lists/tables with no data */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📂",
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center glass-panel-light">
      <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm border border-indigo-100/50">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <GlassButton onClick={onAction} variant="primary" className="px-6">
          {actionLabel}
        </GlassButton>
      )}
    </div>
  );
};

export default EmptyState;
