// Common types for Prompt Guru Backend

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Model Types
// ============================================================================

export type SupportedModel =
  | 'claude-4.5'
  | 'gpt-5.2'
  | 'grok-4.1'
  | 'gemini-3-pro'
  | 'nano-banana'
  | 'grok-aurora'
  | 'grok-imagine'
  | 'perplexity-pro';

export type ModelCategory = 'llm' | 'image' | 'video' | 'search';

export interface ModelInfo {
  slug: SupportedModel;
  name: string;
  producer: string;
  category: ModelCategory;
  specialization: string;
}

// ============================================================================
// Prompt Generation Types
// ============================================================================

export type VersionType = 'extended' | 'standard' | 'minimal';

export type TaskType =
  | 'code-generation'
  | 'code-review'
  | 'analysis'
  | 'creative-writing'
  | 'translation'
  | 'summarization'
  | 'system-prompt'
  | 'image-generation'
  | 'video-generation'
  | 'research'
  | 'general';

export type ToneType = 'formal' | 'casual' | 'technical' | 'concise';

export interface PromptGenerationRequest {
  goal: string;
  model: SupportedModel;
  taskType?: TaskType;
  context?: string;
  tone?: ToneType;
  constraints?: string[];
  examples?: string[];
}

export interface GeneratedPrompt {
  version: VersionType;
  content: string;
  tokenEstimate: number;
}

export interface PromptGenerationResponse {
  versions: {
    extended: GeneratedPrompt;
    standard: GeneratedPrompt;
    minimal: GeneratedPrompt;
  };
  techniques: string[];
  tips: string[];
  model: SupportedModel;
  taskType: TaskType;
}

// ============================================================================
// Prompt Optimization Types
// ============================================================================

export interface OptimizationIssue {
  type: 'critical' | 'warning' | 'suggestion';
  code: string;
  message: string;
  location?: string;
  fix?: string;
}

export interface OptimizationChange {
  type: 'added' | 'removed' | 'modified';
  description: string;
  reason: string;
}

export interface PromptOptimizationRequest {
  originalPrompt: string;
  targetModel: SupportedModel;
  issues?: string[];
}

export interface PromptOptimizationResponse {
  optimizedPrompt: string;
  changes: OptimizationChange[];
  issues: OptimizationIssue[];
  beforeAfter: {
    before: string;
    after: string;
  };
  tokenDelta: number;
}

// ============================================================================
// Recipe Types
// ============================================================================

export type RecipeSlug =
  | 'code-review'
  | 'system-prompt'
  | 'image-generation'
  | 'research'
  | 'video-generation'
  | 'portrait'
  | 'translation'
  | 'summarization'
  | 'debugging'
  | 'fact-check';

export interface Recipe {
  slug: RecipeSlug;
  name: string;
  description: string;
  defaultModel: SupportedModel;
  alternativeModels: SupportedModel[];
  keywords: string[];
  followUpQuestions: string[];
  template?: string;
}

export interface RecipeMatch {
  recipe: Recipe;
  confidence: number;
  matchedKeywords: string[];
}

// ============================================================================
// Model Rules Types
// ============================================================================

export interface ModelRules {
  rules: string[];
  avoid: string[];
  checklist: string[];
  tips: string[];
  quickStart: string;
}

export interface ModelDetails extends ModelInfo {
  rules: ModelRules;
}

// ============================================================================
// Saved Prompt Types (Database)
// ============================================================================

export interface SavedPrompt {
  id: string;
  title: string;
  description?: string;
  content: string;
  model: SupportedModel;
  versionType: VersionType;
  category?: string;
  tags: string[];
  techniques: string[];
  isPublic: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptRequest {
  title: string;
  description?: string;
  content: string;
  model: SupportedModel;
  versionType?: VersionType;
  category?: string;
  tags?: string[];
  techniques?: string[];
  isPublic?: boolean;
}
