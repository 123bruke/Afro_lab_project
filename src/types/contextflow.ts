export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'tasks'
  | 'chat'
  | 'memory'
  | 'context'
  | 'knowledge'
  | 'agents'
  | 'analytics'
  | 'settings';

export type FlowAccentTheme = 'sky' | 'emerald' | 'amber' | 'zinc';

export interface HomeCustomization {
  headline: string;
  subheadline: string;
  flowSpeed: number; // 0.3 to 2.5
  particleDensity: number; // 30 to 140
  cursorRadius: number; // 80 to 360
  accentTheme: FlowAccentTheme;
  showMeshLinks: boolean;
  imageOverlayOpacity: number; // 40 to 90
}

export type TaskStatus = 'Running' | 'Paused' | 'Completed' | 'Blocked';

export interface TaskPhase {
  id: string;
  number: number;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface LongHorizonTask {
  id: string;
  title: string;
  shortTitle: string;
  goal: string;
  status: TaskStatus;
  progress: number;
  currentPhase: number;
  totalPhases: number;
  phases: TaskPhase[];
  memoriesCount: number;
  documentsCount: number;
  sessionsCount: number;
  agentsCount: number;
  assignedAgentIds: string[];
  tokenBurnRate: number; // tokens/min
  totalTokensUsed: number;
  updatedAt: string;
  recoveredMemories: {
    sessionId: string;
    sessionName: string;
    items: {
      memoryId: string;
      title: string;
      matchScore: number;
    }[];
  };
}

export interface Session {
  id: string;
  number: number;
  label: string;
  taskId: string;
  createdAt: string;
  duration: string;
  tokensUsed: number;
  memoriesCreated: number;
  status: 'Active' | 'Archived' | 'Recovered';
  summary: string;
}

export type MemoryCategory =
  | 'Short-term'
  | 'Long-term'
  | 'Preferences'
  | 'Decisions'
  | 'Project Knowledge'
  | 'Important Facts';

export interface MemoryItem {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  source: string;
  sessionId: string;
  taskId: string;
  createdAt: string;
  lastAccessed: string;
  importance: number; // 0 - 100
  relevanceMatch?: number; // 0 - 100 for active retrieval
  tokens: number;
  pinned: boolean;
}

export type MessageRole = 'user' | 'ai' | 'system';

export interface ChatMessage {
  id: string;
  sessionId: string;
  taskId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  latencyMs?: number;
  memoriesSelected?: number;
  tokensDelta?: number;
  attachedFiles?: string[];
  recoveredMemoryTitles?: string[];
}

export type ContextBufferState = 'Active' | 'Compressed' | 'Trimmed';

export interface ContextBufferItem {
  id: string;
  source: string;
  type: 'Memory' | 'Document' | 'System' | 'Conversation' | 'Decision' | 'Task';
  tokens: number;
  originalTokens: number;
  relevance: number; // percentage
  state: ContextBufferState;
  timestamp: string;
  snippet: string;
  taskId: string;
}

export interface ContextTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  detail?: string;
  stage:
    | 'task_created'
    | 'query_vectorized'
    | 'memories_retrieved'
    | 'context_selected'
    | 'context_compressed'
    | 'prompt_prepared'
    | 'response_generated'
    | 'memory_updated';
  latencyMs?: number;
  tokensSaved?: number;
}

export type KnowledgeType = 'Documents' | 'PDFs' | 'URLs' | 'Notes' | 'Datasets';
export type KnowledgeStatus = 'Indexed' | 'Processing' | 'Failed';

export interface KnowledgeSource {
  id: string;
  source: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  updated: string;
  chunks: number;
  memories: number;
  tokens: number;
  taskId: string;
  summary: string;
  sampleChunks: string[];
}

export type AgentStatus = 'Running' | 'Waiting' | 'Completed' | 'Error';

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  pipelineOrder: number;
  status: AgentStatus;
  currentTask: string;
  executionTime: string;
  memoryMb: number;
  tokensProcessed: number;
  lastHeartbeat: string;
  assignedTaskId: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  category: 'compression' | 'memory' | 'task' | 'retrieval' | 'session' | 'agent';
}

export interface ContextBudgetBreakdown {
  system: number;
  task: number;
  retrievedMemory: number;
  documents: number;
  conversation: number;
  totalUsed: number;
  maxBudget: number;
  compressionRatio: number;
}

export interface ReleaseLogEntry {
  id: string;
  version: string;
  date: string;
  category: 'SDK' | 'Hosted Engine' | 'Patches' | 'Optimizations';
  title: string;
  summary: string;
  changes: string[];
  npmPackage?: string;
}

export interface WorkspaceUser {
  name: string;
  email: string;
  photoUrl?: string;
  provider: 'google' | 'github' | 'email' | null;
}

export interface WorkspaceSettings {
  workspaceName: string;
  theme: 'dark-zinc' | 'high-contrast-slate' | 'light-zinc';
  colorMode: 'dark' | 'light';
  defaultBehavior: 'auto-recover' | 'prompt-recover' | 'clean-session';
  maxTokenBudget: number;
  compressionThreshold: number;
  memoryRetrievalLimit: number;
  vectorStorage: 'pgvector (PostgreSQL 16)' | 'ChromaDB Local' | 'Qdrant Embedded';
  localStoragePath: string;
  autoIndexKnowledge: boolean;
  modelTarget: string;
  temperature: number;
  maxOutputTokens: number;
  apiEndpoint: string;
  engineConnected: boolean;
}
