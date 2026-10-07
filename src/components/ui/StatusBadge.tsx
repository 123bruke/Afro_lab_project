import React from 'react';

export type SemanticStatus =
  | 'Running'
  | 'Active'
  | 'Indexed'
  | 'Completed'
  | 'Recovered'
  | 'Waiting'
  | 'Paused'
  | 'Processing'
  | 'Compressed'
  | 'Archived'
  | 'Trimmed'
  | 'Failed'
  | 'Error'
  | 'Blocked';

interface StatusBadgeProps {
  status: SemanticStatus | string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  className = '',
}) => {
  const getStyles = (s: string) => {
    switch (s) {
      case 'Running':
      case 'Active':
      case 'Indexed':
        return {
          dot: 'bg-emerald-400',
          text: 'text-emerald-400',
        };
      case 'Completed':
      case 'Recovered':
        return {
          dot: 'bg-sky-400',
          text: 'text-sky-400',
        };
      case 'Waiting':
      case 'Paused':
      case 'Processing':
      case 'Compressed':
        return {
          dot: 'bg-amber-400',
          text: 'text-amber-400',
        };
      case 'Failed':
      case 'Error':
      case 'Blocked':
        return {
          dot: 'bg-rose-400',
          text: 'text-rose-400',
        };
      case 'Trimmed':
      case 'Archived':
      default:
        return {
          dot: 'bg-zinc-500',
          text: 'text-zinc-400',
        };
    }
  };

  const style = getStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono whitespace-nowrap shrink-0 ${style.text} ${className}`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
        />
      )}
      <span>{status}</span>
    </span>
  );
};
