/**
 * Prompt Types
 */

export const AIModel = {
  CLAUDE_4: 'claude-4.5-opus',
  GPT_5: 'gpt-5.2',
  GROK_4: 'grok-4.1',
  GEMINI_3: 'gemini-3-pro',
  NANO_BANANA: 'nano-banana',
  GROK_AURORA: 'grok-aurora',
  PERPLEXITY_PRO: 'perplexity-pro',
} as const;

export type AIModel = (typeof AIModel)[keyof typeof AIModel];

export const AI_MODEL_LABELS: Record<AIModel, string> = {
  [AIModel.CLAUDE_4]: 'Claude 4.5 Opus',
  [AIModel.GPT_5]: 'GPT-5.2',
  [AIModel.GROK_4]: 'Grok 4.1',
  [AIModel.GEMINI_3]: 'Gemini 3 Pro',
  [AIModel.NANO_BANANA]: 'Nano Banana',
  [AIModel.GROK_AURORA]: 'Grok Aurora',
  [AIModel.PERPLEXITY_PRO]: 'Perplexity Pro',
};

export type VersionType = 'extended' | 'standard' | 'minimal';

export interface PromptVersion {
  id: string;
  type: VersionType;
  content: string;
  tokenCount: number;
  techniques: string[];
  createdAt: string;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  description?: string;
  topic: string;
  context?: string;
  targetModel: AIModel;
  versions: PromptVersion[];
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptState {
  prompts: Prompt[];
  currentPrompt: Prompt | null;
  generatedVersions: PromptVersion[];
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PromptActions {
  generatePrompt: (topic: string, context: string, targetModel: AIModel, techniques?: string[]) => Promise<void>;
  optimizePrompt: (originalPrompt: string, targetModel: AIModel) => Promise<void>;
  savePrompt: (prompt: Partial<Prompt>) => Promise<void>;
  loadPrompts: () => Promise<void>;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  clearGeneratedVersions: () => void;
  setError: (error: string | null) => void;
}

export interface PromptTechnique {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PROMPT_TECHNIQUES: PromptTechnique[] = [
  {
    id: 'chain-of-thought',
    name: 'Łańcuch myśli',
    description: 'Prowadź model przez rozumowanie krok po kroku',
    category: 'Rozumowanie',
  },
  {
    id: 'few-shot',
    name: 'Przykłady Few-Shot',
    description: 'Podaj przykłady, aby wskazać format odpowiedzi',
    category: 'Przykłady',
  },
  {
    id: 'role-prompting',
    name: 'Prompting rolowy',
    description: 'Przypisz modelowi określoną rolę lub personę',
    category: 'Kontekst',
  },
  {
    id: 'structured-output',
    name: 'Strukturyzowane wyjście',
    description: 'Żądaj określonego formatu wyjścia (JSON, tabele itp.)',
    category: 'Format',
  },
  {
    id: 'constraints',
    name: 'Ograniczenia',
    description: 'Zdefiniuj jasne granice i limity',
    category: 'Kontrola',
  },
  {
    id: 'self-consistency',
    name: 'Autoweryfikacja',
    description: 'Poproś model o weryfikację i walidację własnego wyniku',
    category: 'Jakość',
  },
];
