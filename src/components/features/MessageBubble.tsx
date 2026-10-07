import React from 'react';
import { ChatMessage } from '../../types/contextflow';
import { useContextFlow } from '../../context/ContextFlowContext';
import { SystemEvent } from './SystemEvent';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  if (message.role === 'system') {
    return <SystemEvent message={message} />;
  }

  const isUser = message.role === 'user';

  // Render code blocks cleanly
  const renderFormattedContent = (raw: string) => {
    const segments = raw.split(/(```[\s\S]*?```)/g);
    return segments.map((seg, i) => {
      if (seg.startsWith('```') && seg.endsWith('```')) {
        const lines = seg.slice(3, -3).trim().split('\n');
        const firstLine = lines[0]?.trim() || '';
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const codeContent = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
        return (
          <div
            key={i}
            className="my-2 border border-zinc-800 bg-zinc-950 rounded-lg overflow-x-auto"
          >
            {hasLang && (
              <div className="px-3 py-1 border-b border-zinc-800/80 bg-zinc-900/60 text-[10px] font-mono text-zinc-400">
                {firstLine}
              </div>
            )}
            <pre className="p-3 text-xs font-mono text-zinc-200 leading-relaxed overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={i} className="space-y-2 whitespace-pre-wrap leading-relaxed">
          {seg.trim()}
        </div>
      );
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-sky-600 text-white text-sm leading-relaxed">
          {renderFormattedContent(message.content)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] text-sm text-zinc-200 leading-relaxed"
        style={isLight ? { color: '#18181b' } : undefined}
      >
        {renderFormattedContent(message.content)}
      </div>
    </div>
  );
};