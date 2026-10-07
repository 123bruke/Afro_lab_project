import React, { useRef, useState } from 'react';
import {
  Paperclip,
  Send,
  FileText,
  History,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import { MessageBubble } from './MessageBubble';

interface AttachedFile {
  name: string;
  url?: string;
}

const isImageFile = (name: string, type?: string) =>
  (type ? type.startsWith('image/') : false) ||
  /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i.test(name);

const isPdfFile = (name: string, type?: string) =>
  (type ? type === 'application/pdf' : false) || /\.pdf$/i.test(name);

export const ChatPanel: React.FC<{ onOpenHistory?: () => void }> = ({
  onOpenHistory,
}) => {
  const { state, activeTask, activeSession, sendMessage, addKnowledgeSource, notify } =
    useContextFlow();

  const isLight = state.settings.colorMode === 'light';

  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const taskMessages = state.messages.filter((m) => m.taskId === activeTask.id);

  const toAttachedFile = (file: File): AttachedFile => ({
    name: file.name,
    url: isImageFile(file.name, file.type) ? URL.createObjectURL(file) : undefined,
  });

  const registerSources = (files: AttachedFile[], origin: string) => {
    files.forEach(({ name }) => {
      addKnowledgeSource(name, isPdfFile(name) ? 'PDFs' : 'Documents', origin);
    });
  };

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    sendMessage(
      input || 'Process attached context files',
      attachedFiles.map((f) => f.name)
    );
    setInput('');
    setAttachedFiles([]);
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const next = Array.from(files).map(toAttachedFile);
    setAttachedFiles((prev) => [...prev, ...next]);
    registerSources(
      next,
      `Attached directly in ${activeSession.label} for ${activeTask.shortTitle}`
    );
    notify(
      `Attached ${next.length} file${next.length > 1 ? 's' : ''} · images & PDF supported`
    );
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const next = Array.from(files).map(toAttachedFile);
      setAttachedFiles((prev) => [...prev, ...next]);
      registerSources(next, `Dropped into ${activeSession.label} workspace`);
      notify(`Attached ${next.length} file${next.length > 1 ? 's' : ''}`);
    } else {
      const sampleName = 'metta_subgraph_ablation.md';
      setAttachedFiles((prev) => [...prev, { name: sampleName }]);
      notify(`Attached ${sampleName}`);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col h-full relative transition-colors duration-200 ${
        isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
      } ${
        isDraggingOver ? 'ring-1 ring-sky-500 bg-sky-950/10' : ''
      }`}
    >
      {/* Minimal Clean Header */}
      <div className={`px-4 py-3 border-b shrink-0 flex items-center justify-between gap-2 ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900/40'
      }`}>
        <h1 className={`text-base font-semibold truncate ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
          {activeTask.title}
        </h1>
        <button
          type="button"
          onClick={onOpenHistory}
          aria-label="Open memory history"
          title="Memory history"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer shrink-0 ${
            isLight
              ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
              : 'bg-white/5 hover:bg-white/15 border-white/10 text-zinc-200'
          }`}
        >
          <History className="w-3.5 h-3.5 icon-premium" aria-hidden="true" />
          <span>History</span>
        </button>
      </div>

      {/* Conversation Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-3">
          {taskMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Clean Composer (ChatGPT-style) */}
      <div className={`p-3 border-t shrink-0 ${
        isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900/30'
      }`}>
        <div className="max-w-3xl mx-auto">
          {attachedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {attachedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded-lg border ${
                    isLight
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                  }`}
                >
                  {file.url ? (
                    <img
                      src={file.url}
                      alt=""
                      className="w-5 h-5 rounded object-cover border border-zinc-700/60"
                    />
                  ) : isPdfFile(file.name) ? (
                    <FileText className="w-3.5 h-3.5 text-rose-400 icon-premium" aria-hidden="true" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-sky-400 icon-premium" aria-hidden="true" />
                  )}
                  <span className="truncate max-w-[180px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    aria-label={`Remove ${file.name}`}
                    className="text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={`border rounded-2xl transition-colors duration-150 shadow-sm ${
            isLight
              ? 'border-zinc-300 focus-within:border-black bg-zinc-50'
              : 'border-zinc-800 focus-within:border-zinc-600 bg-zinc-900/40'
          }`}>
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Moseb_Ai…"
              className={`w-full p-4 bg-transparent text-sm placeholder-zinc-500 focus:outline-none resize-none font-sans ${
                isLight ? 'text-zinc-950' : 'text-zinc-100'
              }`}
            />

            <div className="px-3 pb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach an image or PDF document"
                  title="Attach an image or PDF"
                  className={`w-8 h-8 grid place-items-center rounded-full transition-colors cursor-pointer ${
                    isLight
                      ? 'text-zinc-600 hover:text-black hover:bg-zinc-200/70'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/10'
                  }`}
                >
                  <Paperclip className="w-4 h-4 icon-premium" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() && attachedFiles.length === 0}
                aria-label="Send message"
                className={`w-8 h-8 grid place-items-center rounded-full transition-all duration-200 cursor-pointer ${
                  input.trim() || attachedFiles.length > 0
                    ? isLight
                      ? 'bg-black text-white hover:bg-zinc-800 shadow-md'
                      : 'bg-sky-400 text-zinc-950 hover:bg-sky-300'
                    : isLight
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 icon-premium" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};