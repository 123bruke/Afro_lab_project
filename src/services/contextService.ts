import {
  ChatMessage,
  LongHorizonTask,
  MemoryItem,
} from '../types/contextflow';

export function formatTimeNow(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function formatShortTimeNow(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function generateContextualResponse(
  prompt: string,
  activeTask: LongHorizonTask,
  memories: MemoryItem[],
  attachedFiles: string[] = []
): {
  systemEvent: ChatMessage;
  aiMessage: ChatMessage;
  newMemory?: MemoryItem;
} {
  const ts = formatTimeNow();
  const trimmed = prompt.trim();
  const taskMemories = memories.filter((m) => m.taskId === activeTask.id || m.pinned);
  const topMemories = taskMemories.slice(0, 4);
  const latency = 180 + Math.floor((trimmed.length * 7) % 190);

  // Check slash commands
  if (trimmed.startsWith('/memory')) {
    const query = trimmed.replace('/memory', '').trim();
    const newMem: MemoryItem = {
      id: `mem_${Date.now().toString(36)}`,
      title: query ? query.slice(0, 48) : `Checkpoint from ${activeTask.shortTitle}`,
      content: query || `Manual memory snapshot captured during ${activeTask.title} (Phase ${activeTask.currentPhase}/${activeTask.totalPhases}).`,
      category: 'Project Knowledge',
      source: 'Session #42',
      sessionId: 'sess_42',
      taskId: activeTask.id,
      createdAt: 'Oct 01, 2026',
      lastAccessed: 'Just now',
      importance: 92,
      relevanceMatch: 97,
      tokens: 640,
      pinned: true,
    };

    return {
      systemEvent: {
        id: `sys_${Date.now()}_1`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'system',
        content: `[${ts}] Explicit memory persisted · ${newMem.id} · 640 tokens indexed in pgvector`,
        timestamp: ts,
        latencyMs: 68,
        memoriesSelected: 1,
      },
      aiMessage: {
        id: `ai_${Date.now()}_2`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'ai',
        content: `Stored and pinned new memory **${newMem.title}** (\`${newMem.id}\`) into \`Project Knowledge\`. It is immediately active in the current context buffer for **${activeTask.title}**.`,
        timestamp: ts,
      },
      newMemory: newMem,
    };
  }

  if (trimmed.startsWith('/context')) {
    return {
      systemEvent: {
        id: `sys_${Date.now()}_1`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'system',
        content: `[${ts}] Context window audit completed · ${latency}ms · ${topMemories.length} active memories verified`,
        timestamp: ts,
        latencyMs: latency,
        memoriesSelected: topMemories.length,
      },
      aiMessage: {
        id: `ai_${Date.now()}_2`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'ai',
        content: `### Active Context Envelope (${activeTask.shortTitle})\n\n- **Task Phase**: Phase ${activeTask.currentPhase} / ${activeTask.totalPhases} (${activeTask.progress}%)\n- **Primary Memories Linked**: ${topMemories.map((m) => `\`${m.title}\` (${m.relevanceMatch ?? m.importance}%)`).join(', ')}\n- **Vector Store**: \`pgvector (PostgreSQL 16)\` · HNSW \`ef_search=64\`\n- **Compression Policy**: Semantic pruning active at 75% budget threshold.`,
        timestamp: ts,
      },
    };
  }

  if (trimmed.startsWith('/task')) {
    const currentPhaseObj = activeTask.phases.find((p) => p.number === activeTask.currentPhase);
    return {
      systemEvent: {
        id: `sys_${Date.now()}_1`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'system',
        content: `[${ts}] Task state synchronized · Phase ${activeTask.currentPhase}/${activeTask.totalPhases} · ${activeTask.progress}% complete`,
        timestamp: ts,
        latencyMs: 95,
        memoriesSelected: topMemories.length,
      },
      aiMessage: {
        id: `ai_${Date.now()}_2`,
        sessionId: 'sess_42',
        taskId: activeTask.id,
        role: 'ai',
        content: `### Task Continuity Status: ${activeTask.title}\n\n- **Current Objective**: ${currentPhaseObj ? currentPhaseObj.title : activeTask.goal}\n- **Completed Phases**: ${activeTask.phases.filter((p) => p.status === 'completed').map((p) => `Phase ${p.number}`).join(', ') || 'None'}\n- **Retained Resources**: ${activeTask.memoriesCount} memories · ${activeTask.documentsCount} documents · ${activeTask.sessionsCount} sessions`,
        timestamp: ts,
      },
    };
  }

  const attachmentNote =
    attachedFiles.length > 0
      ? `\n\nIngested attached context source(s): ${attachedFiles.map((f) => `\`${f}\``).join(', ')} into active session buffer.`
      : '';

  return {
    systemEvent: {
      id: `sys_${Date.now()}_1`,
      sessionId: 'sess_42',
      taskId: activeTask.id,
      role: 'system',
      content: `Context retrieval completed · ${latency}ms · ${topMemories.length + 2} memories selected`,
      timestamp: ts,
      latencyMs: latency,
      memoriesSelected: topMemories.length + 2,
    },
    aiMessage: {
      id: `ai_${Date.now()}_2`,
      sessionId: 'sess_42',
      taskId: activeTask.id,
      role: 'ai',
      content: `Executed with context continuity from **${activeTask.recoveredMemories.sessionName}** and ${topMemories.length} pinned memories (${topMemories.map((m) => `\`${m.title}\``).join(', ')}).\n\nFor **${activeTask.title}** (Phase ${activeTask.currentPhase}/${activeTask.totalPhases}), I have aligned the execution plan with your request:\n\n> "${trimmed}"${attachmentNote}\n\nAll state transitions and token deltas have been recorded in the Context Buffer and Episodic Memory store.`,
      timestamp: ts,
      recoveredMemoryTitles: topMemories.map((m) => m.title),
    },
  };
}
