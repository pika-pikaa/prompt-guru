/**
 * Quick Recipe Types
 */

import type { AIModel } from './prompt';

export interface QuickRecipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  icon: string;
  template: string;
  placeholders: RecipePlaceholder[];
  recommendedModels: AIModel[];
  techniques: string[];
  exampleOutput?: string;
}

export type RecipeCategory =
  | 'writing'
  | 'coding'
  | 'analysis'
  | 'creative'
  | 'business'
  | 'education'
  | 'research';

export const RECIPE_CATEGORY_LABELS: Record<RecipeCategory, string> = {
  writing: 'Pisanie',
  coding: 'Programowanie',
  analysis: 'Analiza',
  creative: 'Kreatywne',
  business: 'Biznes',
  education: 'Edukacja',
  research: 'Badania',
};

export interface RecipePlaceholder {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
  defaultValue?: string;
}

export interface RecipeState {
  recipes: QuickRecipe[];
  selectedRecipe: QuickRecipe | null;
  filledPlaceholders: Record<string, string>;
  isLoading: boolean;
}

export interface RecipeActions {
  loadRecipes: () => Promise<void>;
  selectRecipe: (recipe: QuickRecipe | null) => void;
  setPlaceholderValue: (placeholderId: string, value: string) => void;
  clearPlaceholders: () => void;
  generateFromRecipe: () => Promise<string>;
}
