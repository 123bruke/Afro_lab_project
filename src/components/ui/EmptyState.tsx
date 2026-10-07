import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-md p-8 text-center my-4">
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-3 py-1.5 text-xs font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
