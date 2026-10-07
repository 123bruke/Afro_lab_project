import React from 'react';
import { MemoryItem } from '../../types/contextflow';
import { MemoryCard } from './MemoryCard';
import { EmptyState } from '../ui/EmptyState';

interface MemoryListProps {
  memories: MemoryItem[];
  onPin: (id: string) => void;
  onEdit: (memory: MemoryItem) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string) => void;
  onCreateNew?: () => void;
}

export const MemoryList: React.FC<MemoryListProps> = ({
  memories,
  onPin,
  onEdit,
  onDelete,
  onCopyId,
  onCreateNew,
}) => {
  if (memories.length === 0) {
    return (
      <EmptyState
        title="No memories found"
        description="Try another search or create a new memory."
        actionLabel={onCreateNew ? 'Create Memory' : undefined}
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onPin={onPin}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopyId={onCopyId}
        />
      ))}
    </div>
  );
};
