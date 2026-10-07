import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  INITIAL_ACTIVITY_FEED,
  INITIAL_AGENTS,
  INITIAL_CONTEXT_BUDGET,
  INITIAL_CONTEXT_BUFFER,
  INITIAL_DECISIONS,
  INITIAL_KNOWLEDGE_SOURCES,
  INITIAL_MEMORIES,
  INITIAL_MESSAGES,
  INITIAL_SESSIONS,
  INITIAL_SETTINGS,
  INITIAL_TASKS,
  INITIAL_TIMELINE_EVENTS,
} from '../data/mockData';
import {
  formatShortTimeNow,
  formatTimeNow,
  generateContextualResponse,
} from '../services/contextService';
import {
  ActivityFeedItem,
  AgentNode,
  AgentStatus,
  ChatMessage,
  ContextBudgetBreakdown,
  ContextBufferItem,
  ContextBufferState,
  ContextTimelineEvent,
  KnowledgeSource,
  KnowledgeType,
  LongHorizonTask,
  MemoryCategory,
  MemoryItem,
  NavigationTab,
  Session,
  TaskStatus,
  WorkspaceSettings,
  WorkspaceUser,
  HomeCustomization,
} from '../types/contextflow';

interface ContextFlowState {
  activeTab: NavigationTab;
  activeTaskId: string;
  activeSessionId: string;
  tasks: LongHorizonTask[];
  sessions: Session[];
  memories: MemoryItem[];
  messages: ChatMessage[];
  contextBuffer: ContextBufferItem[];
  timelineEvents: ContextTimelineEvent[];
  knowledgeSources: KnowledgeSource[];
  agents: AgentNode[];
  activityFeed: ActivityFeedItem[];
  contextBudget: ContextBudgetBreakdown;
  decisions: string[];
  settings: WorkspaceSettings;
  homeCustomization: HomeCustomization;
  user: WorkspaceUser | null;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isMobileInspectorOpen: boolean;
  isCommandMenuOpen: boolean;
  inspectedDocumentId: string | null;
  toastMessage: string | null;
}

type Action =
  | { type: 'SET_TAB'; payload: NavigationTab }
  | { type: 'SELECT_TASK'; payload: string }
  | { type: 'SELECT_SESSION'; payload: string }
  | { type: 'CREATE_SESSION'; payload: { taskId: string; summary: string } }
  | { type: 'SEND_MESSAGE'; payload: { content: string; attachedFiles?: string[] } }
  | {
      type: 'CREATE_TASK';
      payload: {
        title: string;
        shortTitle: string;
        goal: string;
        phases: string[];
        assignedAgentIds: string[];
      };
    }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TaskStatus } }
  | { type: 'UPDATE_TASK_PROGRESS'; payload: { taskId: string; progress: number } }
  | { type: 'TOGGLE_TASK_PHASE'; payload: { taskId: string; phaseNumber: number } }
  | { type: 'TOGGLE_TASK_AGENT'; payload: { taskId: string; agentId: string } }
  | {
      type: 'CREATE_MEMORY';
      payload: {
        title: string;
        content: string;
        category: MemoryCategory;
        importance: number;
        pinned: boolean;
        taskId?: string;
      };
    }
  | {
      type: 'UPDATE_MEMORY';
      payload: {
        id: string;
        title: string;
        content: string;
        category: MemoryCategory;
        importance: number;
      };
    }
  | { type: 'DELETE_MEMORY'; payload: string }
  | { type: 'TOGGLE_PIN_MEMORY'; payload: string }
  | { type: 'SET_BUFFER_ITEM_STATE'; payload: { id: string; state: ContextBufferState } }
  | { type: 'COMPRESS_CONTEXT' }
  | { type: 'SIMULATE_PIPELINE_STEP' }
  | {
      type: 'ADD_KNOWLEDGE_SOURCE';
      payload: { source: string; type: KnowledgeType; summary: string };
    }
  | { type: 'REMOVE_KNOWLEDGE_SOURCE'; payload: string }
  | { type: 'REINDEX_KNOWLEDGE_SOURCE'; payload: string }
  | { type: 'SET_AGENT_STATUS'; payload: { agentId: string; status: AgentStatus; currentTask?: string } }
  | { type: 'ADD_DECISION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<WorkspaceSettings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_MOBILE_SIDEBAR'; payload: boolean }
  | { type: 'SET_MOBILE_INSPECTOR'; payload: boolean }
  | { type: 'LOGIN_USER'; payload: WorkspaceUser }
  | { type: 'LOGOUT_USER' }
  | { type: 'SET_COMMAND_MENU'; payload: boolean }
  | { type: 'SET_INSPECTED_DOCUMENT'; payload: string | null }
  | { type: 'UPDATE_HOME_CUSTOMIZATION'; payload: Partial<HomeCustomization> }
  | { type: 'SHOW_TOAST'; payload: string | null };

const initialState: ContextFlowState = {
  activeTab: 'home',
  activeTaskId: 'task_biocypher',
  activeSessionId: 'sess_42',
  tasks: INITIAL_TASKS,
  sessions: INITIAL_SESSIONS,
  memories: INITIAL_MEMORIES,
  messages: INITIAL_MESSAGES,
  contextBuffer: INITIAL_CONTEXT_BUFFER,
  timelineEvents: INITIAL_TIMELINE_EVENTS,
  knowledgeSources: INITIAL_KNOWLEDGE_SOURCES,
  agents: INITIAL_AGENTS,
  activityFeed: INITIAL_ACTIVITY_FEED,
  contextBudget: INITIAL_CONTEXT_BUDGET,
  decisions: INITIAL_DECISIONS,
  settings: INITIAL_SETTINGS,
  homeCustomization: {
    headline: 'The capability-first SDK. Give your website hands, not just a voice.',
    subheadline:
      'Maintain deterministic context windows, client-side function calling, pre-embedding PII redaction, and hosted engine session continuity.',
    flowSpeed: 1.1,
    particleDensity: 75,
    cursorRadius: 210,
    accentTheme: 'sky',
    showMeshLinks: false,
    imageOverlayOpacity: 72,
  },
  user: null,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isMobileInspectorOpen: false,
  isCommandMenuOpen: false,
  inspectedDocumentId: null,
  toastMessage: null,
};

function reducer(state: ContextFlowState, action: Action): ContextFlowState {
  switch (action.type) {
    case 'SET_TAB':
      return {
        ...state,
        activeTab: action.payload,
        isMobileSidebarOpen: false,
      };

    case 'SELECT_TASK': {
      const taskSessions = state.sessions.filter((s) => s.taskId === action.payload);
      const nextSessionId = taskSessions.length > 0 ? taskSessions[0].id : state.activeSessionId;
      return {
        ...state,
        activeTaskId: action.payload,
        activeSessionId: nextSessionId,
      };
    }

    case 'SELECT_SESSION': {
      const session = state.sessions.find((s) => s.id === action.payload);
      return {
        ...state,
        activeSessionId: action.payload,
        activeTaskId: session ? session.taskId : state.activeTaskId,
      };
    }

    case 'CREATE_SESSION': {
      const maxNum = state.sessions.reduce((max, s) => Math.max(max, s.number), 42);
      const nextNum = maxNum + 1;
      const newSession: Session = {
        id: `sess_${nextNum}`,
        number: nextNum,
        label: `Session #${nextNum}`,
        taskId: action.payload.taskId,
        createdAt: `Today, ${formatShortTimeNow()}`,
        duration: 'Just started',
        tokensUsed: 24600,
        memoriesCreated: 0,
        status: 'Active',
        summary: action.payload.summary || `Continuing task execution from Session #${maxNum}`,
      };
      const sysMsg: ChatMessage = {
        id: `sys_new_sess_${Date.now()}`,
        sessionId: newSession.id,
        taskId: action.payload.taskId,
        role: 'system',
        content: `[${formatTimeNow()}] Session #${nextNum} initialized · Restored pinned memories from Session #${maxNum}`,
        timestamp: formatTimeNow(),
        latencyMs: 140,
        memoriesSelected: 4,
      };
      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: 'New session created',
        detail: `Initialized ${newSession.label} with context continuity`,
        category: 'session',
      };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
        activeTaskId: action.payload.taskId,
        messages: [...state.messages, sysMsg],
        activityFeed: [newActivity, ...state.activityFeed],
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, sessionsCount: t.sessionsCount + 1 } : t
        ),
      };
    }

    case 'SEND_MESSAGE': {
      const activeTask =
        state.tasks.find((t) => t.id === state.activeTaskId) || state.tasks[0];
      const userMsg: ChatMessage = {
        id: `usr_${Date.now()}`,
        sessionId: state.activeSessionId,
        taskId: activeTask.id,
        role: 'user',
        content: action.payload.content,
        timestamp: formatTimeNow(),
        attachedFiles: action.payload.attachedFiles,
      };

      const { systemEvent, aiMessage, newMemory } = generateContextualResponse(
        action.payload.content,
        activeTask,
        state.memories,
        action.payload.attachedFiles
      );
      systemEvent.sessionId = state.activeSessionId;
      aiMessage.sessionId = state.activeSessionId;

      const addedTokens = Math.min(2400, Math.max(420, action.payload.content.length * 12));
      const nextMemories = newMemory ? [newMemory, ...state.memories] : state.memories;

      const newTimelineEvent: ContextTimelineEvent = {
        id: `ev_${Date.now()}`,
        timestamp: formatTimeNow(),
        title: newMemory ? 'New memory stored' : 'Model response generated',
        detail: newMemory
          ? `Stored "${newMemory.title}" (${newMemory.tokens} tokens)`
          : `Processed prompt with ${systemEvent.memoriesSelected || 6} retrieved memories (${systemEvent.latencyMs || 210}ms)`,
        stage: newMemory ? 'memory_updated' : 'response_generated',
        latencyMs: systemEvent.latencyMs || 210,
      };

      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: newMemory ? 'Memory stored' : `${systemEvent.memoriesSelected || 6} memories retrieved`,
        detail: newMemory
          ? `Added "${newMemory.title}" to ${newMemory.category}`
          : `Executed context turn on ${activeTask.shortTitle}`,
        category: newMemory ? 'memory' : 'retrieval',
      };

      return {
        ...state,
        messages: [...state.messages, userMsg, systemEvent, aiMessage],
        memories: nextMemories,
        timelineEvents: [newTimelineEvent, ...state.timelineEvents],
        activityFeed: [newActivity, ...state.activityFeed],
        contextBudget: {
          ...state.contextBudget,
          conversation: state.contextBudget.conversation + addedTokens,
          totalUsed: Math.min(
            state.contextBudget.maxBudget,
            state.contextBudget.totalUsed + addedTokens
          ),
        },
      };
    }

    case 'CREATE_TASK': {
      const id = `task_${Date.now().toString(36)}`;
      const phaseList =
        action.payload.phases.length > 0
          ? action.payload.phases
          : ['Initial Architecture & Scope', 'Core Pipeline Implementation', 'Verification & Benchmarks'];
      const newTask: LongHorizonTask = {
        id,
        title: action.payload.title,
        shortTitle: action.payload.shortTitle || action.payload.title.slice(0, 22),
        goal: action.payload.goal,
        status: 'Running',
        progress: 15,
        currentPhase: 1,
        totalPhases: phaseList.length,
        phases: phaseList.map((title, idx) => ({
          id: `${id}_ph_${idx + 1}`,
          number: idx + 1,
          title,
          status: idx === 0 ? 'current' : 'upcoming',
        })),
        memoriesCount: 4,
        documentsCount: 2,
        sessionsCount: 1,
        agentsCount: action.payload.assignedAgentIds.length || 2,
        assignedAgentIds:
          action.payload.assignedAgentIds.length > 0
            ? action.payload.assignedAgentIds
            : ['agent_planner', 'agent_context'],
        tokenBurnRate: 720,
        totalTokensUsed: 18400,
        updatedAt: 'Just now',
        recoveredMemories: {
          sessionId: state.activeSessionId,
          sessionName: 'Session #42',
          items: [
            { memoryId: 'mem_neo4j', title: 'Neo4j configuration', matchScore: 92 },
            { memoryId: 'mem_prev_decision', title: 'Previous implementation decision', matchScore: 88 },
          ],
        },
      };

      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: 'Task created',
        detail: `Created long-horizon task "${newTask.title}"`,
        category: 'task',
      };

      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        activeTaskId: newTask.id,
        activityFeed: [newActivity, ...state.activityFeed],
      };
    }

    case 'UPDATE_TASK_STATUS': {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId
            ? { ...t, status: action.payload.status, updatedAt: 'Just now' }
            : t
        ),
      };
    }

    case 'UPDATE_TASK_PROGRESS': {
      const clamped = Math.max(0, Math.min(100, action.payload.progress));
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.payload.taskId) return t;
          const activePhaseNum = Math.max(
            1,
            Math.min(t.totalPhases, Math.ceil((clamped / 100) * t.totalPhases))
          );
          const updatedPhases = t.phases.map((p) => ({
            ...p,
            status:
              clamped === 100 || p.number < activePhaseNum
                ? ('completed' as const)
                : p.number === activePhaseNum
                ? ('current' as const)
                : ('upcoming' as const),
          }));
          return {
            ...t,
            progress: clamped,
            currentPhase: activePhaseNum,
            phases: updatedPhases,
            status: clamped === 100 ? 'Completed' : t.status,
            updatedAt: 'Just now',
          };
        }),
      };
    }

    case 'TOGGLE_TASK_PHASE': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.payload.taskId) return t;
          const targetNum = action.payload.phaseNumber;
          const updatedPhases = t.phases.map((p) => ({
            ...p,
            status:
              p.number < targetNum
                ? ('completed' as const)
                : p.number === targetNum
                ? ('current' as const)
                : ('upcoming' as const),
          }));
          const completedCount = updatedPhases.filter((p) => p.status === 'completed').length;
          const newProgress = Math.min(
            98,
            Math.max(10, Math.round(((completedCount + 0.5) / t.totalPhases) * 100))
          );
          return {
            ...t,
            currentPhase: targetNum,
            phases: updatedPhases,
            progress: newProgress,
            updatedAt: 'Just now',
          };
        }),
      };
    }

    case 'TOGGLE_TASK_AGENT': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.payload.taskId) return t;
          const exists = t.assignedAgentIds.includes(action.payload.agentId);
          const nextIds = exists
            ? t.assignedAgentIds.filter((id) => id !== action.payload.agentId)
            : [...t.assignedAgentIds, action.payload.agentId];
          return {
            ...t,
            assignedAgentIds: nextIds,
            agentsCount: nextIds.length,
            updatedAt: 'Just now',
          };
        }),
      };
    }

    case 'CREATE_MEMORY': {
      const newMem: MemoryItem = {
        id: `mem_${Date.now().toString(36)}`,
        title: action.payload.title,
        content: action.payload.content,
        category: action.payload.category,
        source:
          state.sessions.find((s) => s.id === state.activeSessionId)?.label || 'Session #42',
        sessionId: state.activeSessionId,
        taskId: action.payload.taskId || state.activeTaskId,
        createdAt: 'Oct 01, 2026',
        lastAccessed: 'Just now',
        importance: action.payload.importance,
        relevanceMatch: action.payload.importance,
        tokens: Math.max(320, Math.round(action.payload.content.length * 8)),
        pinned: action.payload.pinned,
      };
      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: 'Memory created',
        detail: `Retained "${newMem.title}" (${newMem.category})`,
        category: 'memory',
      };
      return {
        ...state,
        memories: [newMem, ...state.memories],
        activityFeed: [newActivity, ...state.activityFeed],
      };
    }

    case 'UPDATE_MEMORY': {
      return {
        ...state,
        memories: state.memories.map((m) =>
          m.id === action.payload.id
            ? {
                ...m,
                title: action.payload.title,
                content: action.payload.content,
                category: action.payload.category,
                importance: action.payload.importance,
                lastAccessed: 'Just now',
              }
            : m
        ),
      };
    }

    case 'DELETE_MEMORY': {
      return {
        ...state,
        memories: state.memories.filter((m) => m.id !== action.payload),
      };
    }

    case 'TOGGLE_PIN_MEMORY': {
      const target = state.memories.find((m) => m.id === action.payload);
      const nextMemories = state.memories.map((m) =>
        m.id === action.payload ? { ...m, pinned: !m.pinned, lastAccessed: 'Just now' } : m
      );
      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: target?.pinned ? 'Memory unpinned' : 'Memory pinned',
        detail: `${target?.pinned ? 'Unpinned' : 'Pinned'} "${target?.title || action.payload}"`,
        category: 'memory',
      };
      return {
        ...state,
        memories: nextMemories,
        activityFeed: [newActivity, ...state.activityFeed],
      };
    }

    case 'SET_BUFFER_ITEM_STATE': {
      const updatedBuffer = state.contextBuffer.map((item) => {
        if (item.id !== action.payload.id) return item;
        const nextState = action.payload.state;
        const nextTokens =
          nextState === 'Trimmed'
            ? 0
            : nextState === 'Compressed'
            ? Math.round(item.originalTokens * 0.62)
            : item.originalTokens;
        return {
          ...item,
          state: nextState,
          tokens: nextTokens,
          timestamp: formatTimeNow(),
        };
      });
      return {
        ...state,
        contextBuffer: updatedBuffer,
      };
    }

    case 'COMPRESS_CONTEXT': {
      let savedTokens = 0;
      const updatedBuffer = state.contextBuffer.map((item) => {
        if (item.state === 'Active' && item.type !== 'System' && item.relevance < 92) {
          const compressedTokens = Math.round(item.tokens * 0.68);
          savedTokens += item.tokens - compressedTokens;
          return {
            ...item,
            state: 'Compressed' as const,
            tokens: compressedTokens,
            timestamp: formatTimeNow(),
          };
        }
        return item;
      });
      if (savedTokens === 0) savedTokens = 2840;

      const nextTotal = Math.max(42000, state.contextBudget.totalUsed - savedTokens);
      const newTimelineEvent: ContextTimelineEvent = {
        id: `ev_${Date.now()}`,
        timestamp: formatTimeNow(),
        title: 'Context compressed',
        detail: `${savedTokens.toLocaleString()} tokens saved via semantic pruning`,
        stage: 'context_compressed',
        latencyMs: 134,
        tokensSaved: savedTokens,
      };
      const newActivity: ActivityFeedItem = {
        id: `act_${Date.now()}`,
        timestamp: formatShortTimeNow(),
        action: 'Context compressed',
        detail: `Reduced active buffer by ${savedTokens.toLocaleString()} tokens`,
        category: 'compression',
      };

      return {
        ...state,
        contextBuffer: updatedBuffer,
        contextBudget: {
          ...state.contextBudget,
          documents: Math.max(8000, state.contextBudget.documents - Math.round(savedTokens * 0.6)),
          conversation: Math.max(
            2400,
            state.contextBudget.conversation - Math.round(savedTokens * 0.4)
          ),
          totalUsed: nextTotal,
          compressionRatio: Math.min(58, state.contextBudget.compressionRatio + 4),
        },
        timelineEvents: [newTimelineEvent, ...state.timelineEvents],
        activityFeed: [newActivity, ...state.activityFeed],
      };
    }

    case 'SIMULATE_PIPELINE_STEP': {
      const stages: ContextTimelineEvent['stage'][] = [
        'query_vectorized',
        'memories_retrieved',
        'context_selected',
        'context_compressed',
        'prompt_prepared',
        'response_generated',
        'memory_updated',
      ];
      const labels: Record<ContextTimelineEvent['stage'], { title: string; detail: string }> = {
        task_created: {
          title: 'Task created',
          detail: 'Initialized context state envelope',
        },
        query_vectorized: {
          title: 'Query vectorized',
          detail: 'Embedded query vector (1536-d) & scanned pgvector HNSW index',
        },
        memories_retrieved: {
          title: 'Memories retrieved',
          detail: '8 candidate memories scored via hybrid cosine + BM25 RRF',
        },
        context_selected: {
          title: 'Context selected',
          detail: 'Selected top-4 memories & 3 active document chunks',
        },
        context_compressed: {
          title: 'Context compressed',
          detail: '2,950 tokens saved across historical turns',
        },
        prompt_prepared: {
          title: 'Context prepared',
          detail: 'Assembled structured prompt envelope within 128K budget',
        },
        response_generated: {
          title: 'Model response generated',
          detail: 'Executed reasoning pass with deterministic schema verification',
        },
        memory_updated: {
          title: 'New memory stored',
          detail: 'Committed turn delta to long-term episodic store',
        },
      };
      const randomStage = stages[state.timelineEvents.length % stages.length];
      const info = labels[randomStage];
      const newEv: ContextTimelineEvent = {
        id: `ev_${Date.now()}`,
        timestamp: formatTimeNow(),
        title: info.title,
        detail: info.detail,
        stage: randomStage,
        latencyMs: 42 + ((state.timelineEvents.length * 29) % 180),
        tokensSaved: randomStage === 'context_compressed' ? 2950 : undefined,
      };
      return {
        ...state,
        timelineEvents: [newEv, ...state.timelineEvents],
      };
    }

    case 'ADD_KNOWLEDGE_SOURCE': {
      const newSource: KnowledgeSource = {
        id: `kn_${Date.now().toString(36)}`,
        source: action.payload.source,
        type: action.payload.type,
        status: 'Indexed',
        updated: 'Just now',
        chunks: 48,
        memories: 5,
        tokens: 5240,
        taskId: state.activeTaskId,
        summary:
          action.payload.summary ||
          `Indexed ${action.payload.source} into active task knowledge vector store.`,
        sampleChunks: [
          `Chunk #01: Extracted technical specification and schema annotations from ${action.payload.source}...`,
        ],
      };
      return {
        ...state,
        knowledgeSources: [newSource, ...state.knowledgeSources],
      };
    }

    case 'REMOVE_KNOWLEDGE_SOURCE': {
      return {
        ...state,
        knowledgeSources: state.knowledgeSources.filter((k) => k.id !== action.payload),
      };
    }

    case 'REINDEX_KNOWLEDGE_SOURCE': {
      return {
        ...state,
        knowledgeSources: state.knowledgeSources.map((k) =>
          k.id === action.payload
            ? {
                ...k,
                status: 'Indexed',
                updated: 'Just now',
                chunks: k.chunks === 0 ? 36 : k.chunks,
                memories: k.memories === 0 ? 4 : k.memories,
                tokens: k.tokens === 0 ? 4100 : k.tokens,
              }
            : k
        ),
      };
    }

    case 'SET_AGENT_STATUS': {
      return {
        ...state,
        agents: state.agents.map((a) =>
          a.id === action.payload.agentId
            ? {
                ...a,
                status: action.payload.status,
                currentTask: action.payload.currentTask || a.currentTask,
                lastHeartbeat: 'Just now',
              }
            : a
        ),
      };
    }

    case 'ADD_DECISION': {
      if (!action.payload.trim()) return state;
      return {
        ...state,
        decisions: [action.payload.trim(), ...state.decisions],
      };
    }

    case 'UPDATE_SETTINGS': {
      const nextSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: nextSettings,
        contextBudget: {
          ...state.contextBudget,
          maxBudget: nextSettings.maxTokenBudget,
        },
      };
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };

    case 'SET_MOBILE_SIDEBAR':
      return { ...state, isMobileSidebarOpen: action.payload };

    case 'SET_MOBILE_INSPECTOR':
      return { ...state, isMobileInspectorOpen: action.payload };

    case 'LOGIN_USER':
      return { ...state, user: action.payload };

    case 'LOGOUT_USER':
      return { ...state, user: null };

    case 'SET_COMMAND_MENU':
      return { ...state, isCommandMenuOpen: action.payload };

    case 'SET_INSPECTED_DOCUMENT':
      return { ...state, inspectedDocumentId: action.payload };

    case 'UPDATE_HOME_CUSTOMIZATION':
      return {
        ...state,
        homeCustomization: { ...state.homeCustomization, ...action.payload },
      };

    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload };

    default:
      return state;
  }
}

interface ContextFlowContextValue {
  state: ContextFlowState;
  activeTask: LongHorizonTask;
  activeSession: Session;
  setTab: (tab: NavigationTab) => void;
  selectTask: (taskId: string) => void;
  selectSession: (sessionId: string) => void;
  createSession: (taskId: string, summary: string) => void;
  sendMessage: (content: string, attachedFiles?: string[]) => void;
  createTask: (data: {
    title: string;
    shortTitle: string;
    goal: string;
    phases: string[];
    assignedAgentIds: string[];
  }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  toggleTaskPhase: (taskId: string, phaseNumber: number) => void;
  toggleTaskAgent: (taskId: string, agentId: string) => void;
  createMemory: (data: {
    title: string;
    content: string;
    category: MemoryCategory;
    importance: number;
    pinned: boolean;
    taskId?: string;
  }) => void;
  updateMemory: (data: {
    id: string;
    title: string;
    content: string;
    category: MemoryCategory;
    importance: number;
  }) => void;
  deleteMemory: (id: string) => void;
  togglePinMemory: (id: string) => void;
  setBufferItemState: (id: string, bufferState: ContextBufferState) => void;
  compressContext: () => void;
  simulatePipelineStep: () => void;
  addKnowledgeSource: (source: string, type: KnowledgeType, summary: string) => void;
  removeKnowledgeSource: (id: string) => void;
  reindexKnowledgeSource: (id: string) => void;
  setAgentStatus: (agentId: string, status: AgentStatus, currentTask?: string) => void;
  addDecision: (decision: string) => void;
  updateSettings: (partial: Partial<WorkspaceSettings>) => void;
  toggleColorMode: () => void;
  updateHomeCustomization: (partial: Partial<HomeCustomization>) => void;
  loginUser: (user: WorkspaceUser) => void;
  logoutUser: () => void;
  toggleSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
  setMobileInspector: (open: boolean) => void;
  setCommandMenu: (open: boolean) => void;
  setInspectedDocument: (docId: string | null) => void;
  notify: (msg: string) => void;
}

const ContextFlowContext = createContext<ContextFlowContextValue | null>(null);

export const ContextFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.colorMode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [state.settings.colorMode]);

  const notify = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: msg });
    window.setTimeout(() => {
      dispatch({ type: 'SHOW_TOAST', payload: null });
    }, 2600);
  }, []);

  const setTab = useCallback((tab: NavigationTab) => dispatch({ type: 'SET_TAB', payload: tab }), []);
  const selectTask = useCallback((taskId: string) => dispatch({ type: 'SELECT_TASK', payload: taskId }), []);
  const selectSession = useCallback((sessionId: string) => dispatch({ type: 'SELECT_SESSION', payload: sessionId }), []);
  const createSession = useCallback(
    (taskId: string, summary: string) => {
      dispatch({ type: 'CREATE_SESSION', payload: { taskId, summary } });
      notify('New session initialized with context continuity');
    },
    [notify]
  );

  const sendMessage = useCallback(
    (content: string, attachedFiles?: string[]) => {
      dispatch({ type: 'SEND_MESSAGE', payload: { content, attachedFiles } });
    },
    []
  );

  const createTask = useCallback(
    (data: {
      title: string;
      shortTitle: string;
      goal: string;
      phases: string[];
      assignedAgentIds: string[];
    }) => {
      dispatch({ type: 'CREATE_TASK', payload: data });
      notify(`Created task "${data.title}"`);
    },
    [notify]
  );

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
      notify(`Task status updated to ${status}`);
    },
    [notify]
  );

  const updateTaskProgress = useCallback((taskId: string, progress: number) => {
    dispatch({ type: 'UPDATE_TASK_PROGRESS', payload: { taskId, progress } });
  }, []);

  const toggleTaskPhase = useCallback((taskId: string, phaseNumber: number) => {
    dispatch({ type: 'TOGGLE_TASK_PHASE', payload: { taskId, phaseNumber } });
  }, []);

  const toggleTaskAgent = useCallback((taskId: string, agentId: string) => {
    dispatch({ type: 'TOGGLE_TASK_AGENT', payload: { taskId, agentId } });
  }, []);

  const createMemory = useCallback(
    (data: {
      title: string;
      content: string;
      category: MemoryCategory;
      importance: number;
      pinned: boolean;
      taskId?: string;
    }) => {
      dispatch({ type: 'CREATE_MEMORY', payload: data });
      notify(`Memory "${data.title}" retained`);
    },
    [notify]
  );

  const updateMemory = useCallback(
    (data: {
      id: string;
      title: string;
      content: string;
      category: MemoryCategory;
      importance: number;
    }) => {
      dispatch({ type: 'UPDATE_MEMORY', payload: data });
      notify(`Memory "${data.title}" updated`);
    },
    [notify]
  );

  const deleteMemory = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_MEMORY', payload: id });
      notify(`Memory ${id} removed`);
    },
    [notify]
  );

  const togglePinMemory = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_PIN_MEMORY', payload: id });
  }, []);

  const setBufferItemState = useCallback(
    (id: string, bufferState: ContextBufferState) => {
      dispatch({ type: 'SET_BUFFER_ITEM_STATE', payload: { id, state: bufferState } });
      notify(`Context item state set to ${bufferState}`);
    },
    [notify]
  );

  const compressContext = useCallback(() => {
    dispatch({ type: 'COMPRESS_CONTEXT' });
    notify('Context compressed · Low-relevance turns pruned');
  }, [notify]);

  const simulatePipelineStep = useCallback(() => {
    dispatch({ type: 'SIMULATE_PIPELINE_STEP' });
    notify('Pipeline telemetry event recorded');
  }, [notify]);

  const addKnowledgeSource = useCallback(
    (source: string, type: KnowledgeType, summary: string) => {
      dispatch({ type: 'ADD_KNOWLEDGE_SOURCE', payload: { source, type, summary } });
      notify(`Source "${source}" queued and indexed`);
    },
    [notify]
  );

  const removeKnowledgeSource = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_KNOWLEDGE_SOURCE', payload: id });
      notify('Knowledge source removed');
    },
    [notify]
  );

  const reindexKnowledgeSource = useCallback(
    (id: string) => {
      dispatch({ type: 'REINDEX_KNOWLEDGE_SOURCE', payload: id });
      notify('Source re-indexed into vector store');
    },
    [notify]
  );

  const setAgentStatus = useCallback(
    (agentId: string, status: AgentStatus, currentTask?: string) => {
      dispatch({ type: 'SET_AGENT_STATUS', payload: { agentId, status, currentTask } });
      notify(`Agent status changed to ${status}`);
    },
    [notify]
  );

  const addDecision = useCallback(
    (decision: string) => {
      dispatch({ type: 'ADD_DECISION', payload: decision });
      notify('Architectural decision recorded in active context');
    },
    [notify]
  );

  const updateSettings = useCallback(
    (partial: Partial<WorkspaceSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: partial });
      notify('Workspace configuration saved');
    },
    [notify]
  );

  const toggleColorMode = useCallback(() => {
    const nextMode = state.settings.colorMode === 'dark' ? 'light' : 'dark';
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        colorMode: nextMode,
        theme: nextMode === 'light' ? 'light-zinc' : 'dark-zinc',
      },
    });
    notify(`Theme switched to ${nextMode} mode`);
  }, [state.settings.colorMode, notify]);

  const updateHomeCustomization = useCallback(
    (partial: Partial<HomeCustomization>) => {
      dispatch({ type: 'UPDATE_HOME_CUSTOMIZATION', payload: partial });
    },
    []
  );

  const loginUser = useCallback((user: WorkspaceUser) => {
    dispatch({ type: 'LOGIN_USER', payload: user });
  }, []);

  const logoutUser = useCallback(() => {
    dispatch({ type: 'LOGOUT_USER' });
  }, []);

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setMobileSidebar = useCallback((open: boolean) => dispatch({ type: 'SET_MOBILE_SIDEBAR', payload: open }), []);
  const setMobileInspector = useCallback((open: boolean) => dispatch({ type: 'SET_MOBILE_INSPECTOR', payload: open }), []);
  const setCommandMenu = useCallback((open: boolean) => dispatch({ type: 'SET_COMMAND_MENU', payload: open }), []);
  const setInspectedDocument = useCallback((docId: string | null) => dispatch({ type: 'SET_INSPECTED_DOCUMENT', payload: docId }), []);

  const activeTask = useMemo(
    () => state.tasks.find((t) => t.id === state.activeTaskId) || state.tasks[0],
    [state.tasks, state.activeTaskId]
  );

  const activeSession = useMemo(
    () => state.sessions.find((s) => s.id === state.activeSessionId) || state.sessions[0],
    [state.sessions, state.activeSessionId]
  );

  const value = useMemo(
    () => ({
      state,
      activeTask,
      activeSession,
      setTab,
      selectTask,
      selectSession,
      createSession,
      sendMessage,
      createTask,
      updateTaskStatus,
      updateTaskProgress,
      toggleTaskPhase,
      toggleTaskAgent,
      createMemory,
      updateMemory,
      deleteMemory,
      togglePinMemory,
      setBufferItemState,
      compressContext,
      simulatePipelineStep,
      addKnowledgeSource,
      removeKnowledgeSource,
      reindexKnowledgeSource,
      setAgentStatus,
      addDecision,
      updateSettings,
      toggleColorMode,
      updateHomeCustomization,
      loginUser,
      logoutUser,
      toggleSidebar,
      setMobileSidebar,
      setMobileInspector,
      setCommandMenu,
      setInspectedDocument,
      notify,
    }),
    [
      state,
      activeTask,
      activeSession,
      setTab,
      selectTask,
      selectSession,
      createSession,
      sendMessage,
      createTask,
      updateTaskStatus,
      updateTaskProgress,
      toggleTaskPhase,
      toggleTaskAgent,
      createMemory,
      updateMemory,
      deleteMemory,
      togglePinMemory,
      setBufferItemState,
      compressContext,
      simulatePipelineStep,
      addKnowledgeSource,
      removeKnowledgeSource,
      reindexKnowledgeSource,
      setAgentStatus,
      addDecision,
      updateSettings,
      toggleColorMode,
      updateHomeCustomization,
      loginUser,
      logoutUser,
      toggleSidebar,
      setMobileSidebar,
      setMobileInspector,
      setCommandMenu,
      setInspectedDocument,
      notify,
    ]
  );

  return <ContextFlowContext.Provider value={value}>{children}</ContextFlowContext.Provider>;
};

export function useContextFlow(): ContextFlowContextValue {
  const ctx = useContext(ContextFlowContext);
  if (!ctx) {
    throw new Error('useContextFlow must be used within a ContextFlowProvider');
  }
  return ctx;
}
