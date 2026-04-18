import React from 'react';

/** Pulsing skeleton placeholder for loading states */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/60 rounded-xl ${className}`} />
);

/** Card-shaped skeleton block */
export const SkeletonCard: React.FC = () => (
  <div className="glass-panel-light p-6 space-y-4">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-8 w-20 rounded-lg" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

/** Table-shaped skeleton */
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="glass-panel-light p-0 overflow-hidden">
    <div className="p-6 border-b border-white/40">
      <Skeleton className="h-5 w-40" />
    </div>
    <div className="divide-y divide-white/30">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
