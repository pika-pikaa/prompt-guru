import { create } from 'zustand';
import type { Prompt, PromptVersion, AIModel } from '@/types';
import { api, apiHelpers } from '@/lib/api';

interface PromptState {
  prompts: Prompt[];
  currentPrompt: Prompt | null;
  generatedVersions: PromptVersion[];
  isGenerating: boolean;
  isOptimizing: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  optimizedPrompt: string | null;
  optimizationImprovements: string[];
}

interface PromptActions {
  generatePrompt: (
    topic: string,
    context: string,
    targetModel: AIModel,
    techniques?: string[]
  ) => Promise<void>;
  optimizePrompt: (originalPrompt: string, targetModel: AIModel) => Promise<void>;
  savePrompt: (prompt: Partial<Prompt>) => Promise<void>;
  loadPrompts: () => Promise<void>;
  loadPromptById: (id: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  setCurrentPrompt: (prompt: Prompt | null) => void;
  clearGeneratedVersions: () => void;
  clearOptimizedPrompt: () => void;
  setError: (error: string | null) => void;
  toggleFavorite: (id: string) => Promise<void>;
}

type PromptStore = PromptState & PromptActions;

export const usePromptStore = create<PromptStore>()((set, get) => ({
  // State
  prompts: [],
  currentPrompt: null,
  generatedVersions: [],
  isGenerating: false,
  isOptimizing: false,
  isLoading: false,
  isSaving: false,
  error: null,
  optimizedPrompt: null,
  optimizationImprovements: [],

  // Actions
  generatePrompt: async (
    topic: string,
    context: string,
    targetModel: AIModel,
    techniques?: string[]
  ) => {
    set({ isGenerating: true, error: null, generatedVersions: [] });
    try {
      const response = await api.post('/prompts/generate', {
        topic,
        context,
        targetModel,
        techniques,
      });

      const { versions } = response.data.data;

      // Convert API response to PromptVersion format
      const generatedVersions: PromptVersion[] = versions.map(
        (v: { type: string; content: string; tokenCount: number; techniques: string[] }, index: number) => ({
          id: `generated-${index}`,
          type: v.type as PromptVersion['type'],
          content: v.content,
          tokenCount: v.tokenCount,
          techniques: v.techniques,
          createdAt: new Date().toISOString(),
        })
      );

      set({ generatedVersions, isGenerating: false });
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message, isGenerating: false });
      throw new Error(message);
    }
  },

  optimizePrompt: async (originalPrompt: string, targetModel: AIModel) => {
    set({
      isOptimizing: true,
      error: null,
      optimizedPrompt: null,
      optimizationImprovements: [],
    });
    try {
      const response = await api.post('/prompts/optimize', {
        originalPrompt,
        targetModel,
      });

      const { optimizedPrompt, improvements } = response.data.data;

      set({
        optimizedPrompt,
        optimizationImprovements: improvements,
        isOptimizing: false,
      });
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message, isOptimizing: false });
      throw new Error(message);
    }
  },

  savePrompt: async (promptData: Partial<Prompt>) => {
    set({ isSaving: true, error: null });
    try {
      const response = await api.post('/prompts', promptData);
      const savedPrompt = response.data.data;

      set((state) => ({
        prompts: [savedPrompt, ...state.prompts],
        currentPrompt: savedPrompt,
        isSaving: false,
      }));
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message, isSaving: false });
      throw new Error(message);
    }
  },

  loadPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/prompts');
      const prompts = response.data.data;

      set({ prompts, isLoading: false });
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  loadPromptById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/prompts/${id}`);
      const prompt = response.data.data;

      set({ currentPrompt: prompt, isLoading: false });
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  deletePrompt: async (id: string) => {
    try {
      await api.delete(`/prompts/${id}`);

      set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id),
        currentPrompt: state.currentPrompt?.id === id ? null : state.currentPrompt,
      }));
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  setCurrentPrompt: (prompt: Prompt | null) => {
    set({ currentPrompt: prompt });
  },

  clearGeneratedVersions: () => {
    set({ generatedVersions: [] });
  },

  clearOptimizedPrompt: () => {
    set({ optimizedPrompt: null, optimizationImprovements: [] });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  toggleFavorite: async (id: string) => {
    const prompt = get().prompts.find((p) => p.id === id);
    if (!prompt) return;

    try {
      await api.patch(`/prompts/${id}`, {
        isFavorite: !prompt.isFavorite,
      });

      set((state) => ({
        prompts: state.prompts.map((p) =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ),
        currentPrompt:
          state.currentPrompt?.id === id
            ? { ...state.currentPrompt, isFavorite: !state.currentPrompt.isFavorite }
            : state.currentPrompt,
      }));
    } catch (error) {
      const message = apiHelpers.getErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },
}));
