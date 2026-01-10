/**
 * Quick Recipes Service
 *
 * Matches user input to pre-defined recipes and returns recommended model
 * and follow-up questions.
 */

import { type ModelType } from './model-rules.service.js';

// ============================================================================
// Types
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
  defaultModel: ModelType;
  alternativeModels: ModelType[];
  keywords: string[];
  followUpQuestions: string[];
  template?: string;
}

export interface RecipeMatch {
  recipe: Recipe;
  confidence: number; // 0-1
  matchedKeywords: string[];
}

// ============================================================================
// Recipe Definitions
// ============================================================================

export const RECIPES: Record<RecipeSlug, Recipe> = {
  'code-review': {
    slug: 'code-review',
    name: 'Przeglad kodu',
    description: 'Przeanalizuj kod pod katem bledow, wydajnosci i najlepszych praktyk',
    defaultModel: 'claude-4.5',
    alternativeModels: ['gpt-5.2', 'grok-4.1'],
    keywords: [
      'code review',
      'review kodu',
      'przejrzyj kod',
      'sprawdz kod',
      'analiza kodu',
      'bug',
      'wydajnosc',
      'refactor',
      'optymalizacja',
    ],
    followUpQuestions: [
      'W jakim jezyku programowania jest kod?',
      'Na czym szczegolnie Ci zalezy? (bugi, wydajnosc, czytelnosc, bezpieczenstwo)',
      'Czy to kod produkcyjny czy prototyp?',
    ],
    template: `<context>
Projekt: [nazwa projektu]
Technologia: [stack technologiczny]
Rola kodu: [co robi ten fragment]
</context>

<task>
Przeprowadz code review pod katem:
- [kryteria do analizy]
</task>

<code>
[wklej kod]
</code>

<output_format>
## Podsumowanie
[1-2 zdania]

## Problemy krytyczne
[lista z przykladami poprawy]

## Sugestie optymalizacji
[lista]
</output_format>`,
  },

  'system-prompt': {
    slug: 'system-prompt',
    name: 'Prompt systemowy',
    description: 'Stworz prompt systemowy dla chatbota lub asystenta AI',
    defaultModel: 'claude-4.5',
    alternativeModels: ['gpt-5.2'],
    keywords: [
      'system prompt',
      'chatbot',
      'asystent',
      'bot',
      'persona',
      'rola',
      'zachowanie',
      'character',
    ],
    followUpQuestions: [
      'Jaka rola/persona ma miec asystent?',
      'Dla jakiej firmy/projektu?',
      'Jaki ton komunikacji? (formalny/swobodny/techniczny)',
      'Jakie sa glowne zadania asystenta?',
    ],
    template: `## Rola
Jestes [rola/persona] specjalizujacym sie w [dziedzina].

## Kontekst
[Tlo, dla kogo, w jakim srodowisku]

## Glowne zadania
- [Zadanie 1]
- [Zadanie 2]
- [Zadanie 3]

## Styl komunikacji
- Ton: [formalny/swobodny/techniczny]
- Dlugosc: [zwiezly/szczegolowy]

## Ograniczenia
- [Czego nie robic]
- [Jakich tematow unikac]`,
  },

  'image-generation': {
    slug: 'image-generation',
    name: 'Generowanie obrazu',
    description: 'Stworz prompt do generowania obrazu',
    defaultModel: 'nano-banana',
    alternativeModels: ['grok-aurora'],
    keywords: [
      'obraz',
      'zdjecie',
      'grafika',
      'ilustracja',
      'image',
      'picture',
      'wygeneruj obraz',
      'stworz grafike',
      'art',
    ],
    followUpQuestions: [
      'Co ma przedstawiac obraz?',
      'Jaki styl? (fotorealizm, anime, akwarela, itp.)',
      'Jakie oswietlenie/pora dnia?',
      'Jaki nastroj/atmosfera?',
    ],
    template: `[Glowny podmiot] w [lokalizacja].
[Oswietlenie] i [atmosfera].
Styl: [nazwa stylu].`,
  },

  research: {
    slug: 'research',
    name: 'Badanie / Analiza',
    description: 'Przeprowadz badanie z wielu zrodel z weryfikacja',
    defaultModel: 'perplexity-pro',
    alternativeModels: ['claude-4.5'],
    keywords: [
      'research',
      'badanie',
      'analiza rynku',
      'raport',
      'deep research',
      'zrodla',
      'publikacje',
      'academic',
      'sprawdz',
      'znajdz informacje',
    ],
    followUpQuestions: [
      'Jaki temat do zbadania?',
      'Jaki zakres czasowy? (np. 2024-2025)',
      'Jakie typy zrodel preferujesz? (akademickie, branżowe, oficjalne)',
      'Jaki format raportu?',
    ],
    template: `[Pytanie badawcze]

Zakres czasowy: [np. 2024-2025]
Zrodla: [np. peer-reviewed, oficjalne dokumentacje]
Format: [tabela/lista/raport]

Uwzględnij rozne perspektywy i cytuj zrodla.`,
  },

  'video-generation': {
    slug: 'video-generation',
    name: 'Generowanie wideo',
    description: 'Stworz prompt do generowania krotkich klipow wideo',
    defaultModel: 'grok-imagine',
    alternativeModels: [],
    keywords: [
      'wideo',
      'video',
      'animacja',
      'clip',
      'film',
      'ruch',
      'motion',
    ],
    followUpQuestions: [
      'Co ma przedstawiac wideo?',
      'Jaki ruch podmiotu?',
      'Jaki ruch kamery? (static, pan, tracking)',
      'Jaki nastroj/styl?',
    ],
    template: `[Podmiot + ruch], [tlo + ruch],
[ruch kamery: slow pan right / tracking / static],
[styl: cinematic / documentary], [atmosfera]`,
  },

  portrait: {
    slug: 'portrait',
    name: 'Portret / Zdjecie profilowe',
    description: 'Stworz fotorealistyczny portret lub zdjecie profilowe',
    defaultModel: 'grok-aurora',
    alternativeModels: ['nano-banana'],
    keywords: [
      'portret',
      'portrait',
      'headshot',
      'zdjecie profilowe',
      'twarz',
      'osoba',
      'fotografia portretowa',
    ],
    followUpQuestions: [
      'Kogo ma przedstawiac portret?',
      'Jaki typ ujecia? (headshot, do pasa, pelna postac)',
      'Jaki styl? (profesjonalny, artystyczny, casual)',
      'Jakie tlo/lokalizacja?',
    ],
    template: `Professional [typ ujecia] of [opis osoby],
[tlo], [oswietlenie: natural window lighting / studio],
sharp focus on eyes, [styl: corporate / editorial],
[dodatkowe detale]`,
  },

  translation: {
    slug: 'translation',
    name: 'Tlumaczenie',
    description: 'Przetlumacz tekst z zachowaniem stylu i kontekstu',
    defaultModel: 'gpt-5.2',
    alternativeModels: ['claude-4.5', 'gemini-3-pro'],
    keywords: [
      'tlumaczenie',
      'przetlumacz',
      'translate',
      'translation',
      'z polskiego',
      'na polski',
      'z angielskiego',
    ],
    followUpQuestions: [
      'Z jakiego na jaki jezyk?',
      'Jaki styl? (formalny/swobodny/techniczny)',
      'Gdzie bedzie uzyty tekst? (strona www, dokument, UI)',
    ],
    template: `Przetlumacz ponizszy tekst z [jezyk zrodlowy] na [jezyk docelowy].

Styl: [formalny/swobodny/techniczny]
Kontekst: [gdzie bedzie uzyty]

Tekst:
[tekst do tlumaczenia]

Zachowaj formatowanie i terminy techniczne.`,
  },

  summarization: {
    slug: 'summarization',
    name: 'Podsumowanie',
    description: 'Streszczenie tekstu lub dokumentu',
    defaultModel: 'claude-4.5',
    alternativeModels: ['gpt-5.2', 'gemini-3-pro'],
    keywords: [
      'podsumowanie',
      'streszczenie',
      'summarize',
      'summary',
      'skrot',
      'w skrocie',
      'tldr',
    ],
    followUpQuestions: [
      'Jak dlugie ma byc podsumowanie? (zdania/punkty/akapity)',
      'Na czym sie skupic? (wnioski/fakty/decyzje)',
      'Dla kogo jest podsumowanie?',
    ],
    template: `Podsumuj ponizszy tekst.

Dlugosc: [np. 3-5 zdan / 5 punktow]
Skupienie: [glowne wnioski / fakty / decyzje]
Format: [proza / lista / tabela]

Tekst:
[tekst do podsumowania]`,
  },

  debugging: {
    slug: 'debugging',
    name: 'Debugowanie',
    description: 'Znajdz i napraw blad w kodzie',
    defaultModel: 'claude-4.5',
    alternativeModels: ['gpt-5.2', 'grok-4.1'],
    keywords: [
      'debug',
      'debugowanie',
      'bug',
      'blad',
      'error',
      'nie dziala',
      'problem z kodem',
      'napraw',
      'fix',
    ],
    followUpQuestions: [
      'Jaki jest oczekiwany efekt?',
      'Co sie dzieje zamiast tego?',
      'Jaki jest komunikat bledu (jesli jest)?',
      'Co juz probowales?',
    ],
    template: `Mam problem z kodem:

Oczekiwane zachowanie:
[co powinno sie dziac]

Aktualne zachowanie:
[co sie dzieje]

Error message (jesli jest):
\`\`\`
[blad]
\`\`\`

Kod:
\`\`\`[jezyk]
[kod z bugiem]
\`\`\`

Co juz probowalem:
- [proba 1]
- [proba 2]

Pomoz zdiagnozowac przyczyne i zaproponuj rozwiazanie.`,
  },

  'fact-check': {
    slug: 'fact-check',
    name: 'Weryfikacja faktow',
    description: 'Sprawdz prawdziwosc twierdzenia',
    defaultModel: 'perplexity-pro',
    alternativeModels: [],
    keywords: [
      'sprawdz',
      'zweryfikuj',
      'fact check',
      'czy to prawda',
      'potwierdz',
      'prawdziwosc',
    ],
    followUpQuestions: [
      'Jakie twierdzenie chcesz zweryfikowac?',
      'Jakie zrodla preferujesz? (akademickie, oficjalne)',
    ],
    template: `Zweryfikuj twierdzenie: "[twierdzenie]"

Znajdz zrodla potwierdzajace i zaprzeczajace.
Ocen wiarygodnosc na podstawie jakosci zrodel.
Podaj jednoznaczna ocene: PRAWDA / FALSZ / CZESCIOWO PRAWDA.`,
  },
};

// ============================================================================
// Matching Functions
// ============================================================================

/**
 * Calculate match score for a recipe based on keywords
 */
const calculateMatchScore = (
  input: string,
  recipe: Recipe
): { score: number; matchedKeywords: string[] } => {
  const normalizedInput = input.toLowerCase().trim();
  const matchedKeywords: string[] = [];
  let score = 0;

  for (const keyword of recipe.keywords) {
    if (normalizedInput.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
      // Longer keywords are more specific, give them more weight
      score += keyword.length / 10;
    }
  }

  // Normalize score to 0-1 range
  const maxPossibleScore = recipe.keywords.reduce(
    (sum, kw) => sum + kw.length / 10,
    0
  );
  const normalizedScore = maxPossibleScore > 0 ? score / maxPossibleScore : 0;

  // Boost score if multiple keywords match
  const multiMatchBonus = Math.min(matchedKeywords.length * 0.1, 0.3);

  return {
    score: Math.min(normalizedScore + multiMatchBonus, 1),
    matchedKeywords,
  };
};

/**
 * Match user input to the best recipe
 */
export const matchRecipe = (input: string): RecipeMatch | null => {
  if (!input || input.trim().length < 3) {
    return null;
  }

  const matches: RecipeMatch[] = [];

  for (const recipe of Object.values(RECIPES)) {
    const { score, matchedKeywords } = calculateMatchScore(input, recipe);

    if (score > 0.1 && matchedKeywords.length > 0) {
      matches.push({
        recipe,
        confidence: score,
        matchedKeywords,
      });
    }
  }

  if (matches.length === 0) {
    return null;
  }

  // Sort by confidence and return best match
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches[0];
};

/**
 * Get all matching recipes above a threshold
 */
export const findMatchingRecipes = (
  input: string,
  threshold: number = 0.1
): RecipeMatch[] => {
  if (!input || input.trim().length < 3) {
    return [];
  }

  const matches: RecipeMatch[] = [];

  for (const recipe of Object.values(RECIPES)) {
    const { score, matchedKeywords } = calculateMatchScore(input, recipe);

    if (score >= threshold && matchedKeywords.length > 0) {
      matches.push({
        recipe,
        confidence: score,
        matchedKeywords,
      });
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Get all available recipes
 */
export const getAllRecipes = (): Recipe[] => {
  return Object.values(RECIPES);
};

/**
 * Get recipe by slug
 */
export const getRecipeBySlug = (slug: RecipeSlug): Recipe | null => {
  return RECIPES[slug] || null;
};

/**
 * Get recipes by model
 */
export const getRecipesByModel = (model: ModelType): Recipe[] => {
  return Object.values(RECIPES).filter(
    (r) => r.defaultModel === model || r.alternativeModels.includes(model)
  );
};

// ============================================================================
// Service Export
// ============================================================================

const quickRecipesService = {
  matchRecipe,
  findMatchingRecipes,
  getAllRecipes,
  getRecipeBySlug,
  getRecipesByModel,
  RECIPES,
};

export default quickRecipesService;
