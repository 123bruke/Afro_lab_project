import React from 'react';
import { ChatMessage } from '../../types/contextflow';

interface SystemEventProps {
  message: ChatMessage;
}

export const SystemEvent: React.FC<SystemEventProps> = ({ message }) => {
  return (
    <div className="py-1.5 px-3 my-1 border-l-2 border-zinc-700 bg-zinc-900/30 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
      <span className="text-zinc-500">[{message.timestamp}]</span>
      <span className="text-zinc-300">{message.content}</span>
    </div>
  );
};
