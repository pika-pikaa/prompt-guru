import { type FC, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Lightbulb,
  Search,
  Filter,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  Input,
  Button,
  Badge,
} from '@/components/ui';
import { QuickRecipeCard } from '@/components/display';
import { cn } from '@/lib/utils';
import { prefersReducedMotion, getStaggerDelay } from '@/lib/animations';
import { AIModel } from '@/types';
import type { RecipeCategory, QuickRecipe } from '@/types';

// Mock recipes data - in production this would come from the API
const MOCK_RECIPES: QuickRecipe[] = [
  {
    id: '1',
    name: 'Pisarz wpisów na blog',
    description: 'Generuj angażujące wpisy na blog na dowolny temat z optymalizacją SEO i przekonującą strukturą',
    category: 'writing',
    icon: 'FileText',
    template: 'Napisz kompleksowy wpis na blog o {{topic}}, który jest zoptymalizowany pod SEO, angażujący i informacyjny.',
    placeholders: [
      { id: 'topic', name: 'Temat', description: 'Główny temat wpisu na blog', type: 'text', required: true },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['structured-output', 'role-prompting', 'few-shot'],
  },
  {
    id: '2',
    name: 'Recenzent kodu',
    description: 'Otrzymaj szczegółowe recenzje kodu z sugestiami ulepszeń, najlepszymi praktykami i potencjalnymi błędami',
    category: 'coding',
    icon: 'Code',
    template: 'Przejrzyj poniższy kod pod kątem błędów, problemów z wydajnością i najlepszych praktyk...',
    placeholders: [
      { id: 'code', name: 'Kod', description: 'Kod do przeglądu', type: 'textarea', required: true },
      { id: 'language', name: 'Język', description: 'Język programowania', type: 'text', required: true },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['chain-of-thought', 'constraints', 'self-consistency'],
  },
  {
    id: '3',
    name: 'Analizator danych',
    description: 'Analizuj zbiory danych i wyciągaj znaczące wnioski z analizą statystyczną',
    category: 'analysis',
    icon: 'Search',
    template: 'Przeanalizuj poniższe dane i podaj wnioski, trendy oraz rekomendacje...',
    placeholders: [
      { id: 'data', name: 'Dane', description: 'Dane do analizy', type: 'textarea', required: true },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GEMINI_3],
    techniques: ['structured-output', 'chain-of-thought'],
  },
  {
    id: '4',
    name: 'Generator historii',
    description: 'Twórz porywające historie z niestandardowymi postaciami, fabułami i elementami budowania świata',
    category: 'creative',
    icon: 'Lightbulb',
    template: 'Napisz kreatywną historię o {{premise}} z angażującymi postaciami i zwrotami akcji...',
    placeholders: [
      { id: 'premise', name: 'Założenie', description: 'Założenie lub pomysł na historię', type: 'textarea', required: true },
      { id: 'genre', name: 'Gatunek', description: 'Gatunek historii', type: 'select', required: false, options: ['Fantasy', 'Sci-Fi', 'Romans', 'Kryminał', 'Horror'] },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['role-prompting', 'few-shot', 'constraints'],
  },
  {
    id: '5',
    name: 'Propozycja biznesowa',
    description: 'Twórz profesjonalne propozycje biznesowe i prezentacje z podsumowaniami wykonawczymi',
    category: 'business',
    icon: 'Briefcase',
    template: 'Stwórz profesjonalną propozycję biznesową dla {{project}} zawierającą podsumowanie wykonawcze, zakres i budżet...',
    placeholders: [
      { id: 'project', name: 'Projekt', description: 'Opis projektu', type: 'textarea', required: true },
      { id: 'audience', name: 'Odbiorcy docelowi', description: 'Kto będzie to czytać', type: 'text', required: false },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['structured-output', 'constraints', 'role-prompting'],
  },
  {
    id: '6',
    name: 'Planista lekcji',
    description: 'Projektuj kompleksowe plany lekcji z celami nauczania, aktywnościami i ocenami',
    category: 'education',
    icon: 'GraduationCap',
    template: 'Stwórz szczegółowy plan lekcji do nauczania {{subject}} dla {{audience}}...',
    placeholders: [
      { id: 'subject', name: 'Przedmiot', description: 'Przedmiot do nauczania', type: 'text', required: true },
      { id: 'audience', name: 'Odbiorcy', description: 'Docelowi uczniowie', type: 'text', required: true },
      { id: 'duration', name: 'Czas trwania', description: 'Czas trwania lekcji', type: 'text', required: false },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GEMINI_3],
    techniques: ['structured-output', 'chain-of-thought'],
  },
  {
    id: '7',
    name: 'Asystent badawczy',
    description: 'Przeprowadzaj badania i kompiluj wyniki z cytowaniami i analizą',
    category: 'research',
    icon: 'BookOpen',
    template: 'Zbadaj {{topic}} i dostarcz kompleksową analizę z kluczowymi wnioskami...',
    placeholders: [
      { id: 'topic', name: 'Temat', description: 'Temat badań', type: 'text', required: true },
    ],
    recommendedModels: [AIModel.PERPLEXITY_PRO, AIModel.CLAUDE_4],
    techniques: ['chain-of-thought', 'self-consistency', 'structured-output'],
  },
  {
    id: '8',
    name: 'Generator promptów do obrazów',
    description: 'Twórz szczegółowe prompty do generowania obrazów dla modeli AI art',
    category: 'creative',
    icon: 'Lightbulb',
    template: 'Wygeneruj szczegółowy prompt do obrazu dla {{concept}} ze stylem, oświetleniem i kompozycją...',
    placeholders: [
      { id: 'concept', name: 'Koncepcja', description: 'Koncepcja obrazu', type: 'text', required: true },
      { id: 'style', name: 'Styl', description: 'Styl artystyczny', type: 'select', required: false, options: ['Fotorealistyczny', 'Digital Art', 'Obraz olejny', 'Akwarela', 'Anime'] },
    ],
    recommendedModels: [AIModel.GROK_AURORA],
    techniques: ['constraints', 'few-shot'],
  },
  {
    id: '9',
    name: 'Kompozytor emaili',
    description: 'Pisz profesjonalne emaile dla różnych kontekstów biznesowych',
    category: 'business',
    icon: 'Briefcase',
    template: 'Skomponuj profesjonalny email dla {{purpose}} z odpowiednim tonem i strukturą...',
    placeholders: [
      { id: 'purpose', name: 'Cel', description: 'Cel emaila', type: 'text', required: true },
      { id: 'tone', name: 'Ton', description: 'Ton emaila', type: 'select', required: false, options: ['Formalny', 'Przyjazny', 'Pilny', 'Przypomnienie'] },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['role-prompting', 'constraints'],
  },
  {
    id: '10',
    name: 'Generator testów jednostkowych',
    description: 'Generuj kompleksowe testy jednostkowe dla swojego kodu z przypadkami brzegowymi',
    category: 'coding',
    icon: 'Code',
    template: 'Wygeneruj testy jednostkowe dla poniższego kodu, w tym przypadki brzegowe i obsługę błędów...',
    placeholders: [
      { id: 'code', name: 'Kod', description: 'Kod do testowania', type: 'textarea', required: true },
      { id: 'framework', name: 'Framework', description: 'Framework testowy', type: 'select', required: false, options: ['Jest', 'Pytest', 'JUnit', 'Mocha', 'RSpec'] },
    ],
    recommendedModels: [AIModel.CLAUDE_4, AIModel.GPT_5],
    techniques: ['chain-of-thought', 'structured-output', 'constraints'],
  },
];

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  writing: 'Pisanie',
  coding: 'Programowanie',
  analysis: 'Analiza',
  creative: 'Kreatywność',
  business: 'Biznes',
  education: 'Edukacja',
  research: 'Badania',
};

export const QuickRecipesPage: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const reducedMotion = prefersReducedMotion();

  const categories: (RecipeCategory | 'all')[] = [
    'all',
    'writing',
    'coding',
    'analysis',
    'creative',
    'business',
    'education',
    'research',
  ];

  const filteredRecipes = useMemo(() => {
    return MOCK_RECIPES.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.techniques.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'all' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleUseRecipe = useCallback(
    (recipe: QuickRecipe) => {
      // Navigate to create page with pre-filled recipe data
      navigate('/create', { state: { recipe } });
    },
    [navigate]
  );

  const recipeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_RECIPES.length };
    MOCK_RECIPES.forEach((recipe) => {
      counts[recipe.category] = (counts[recipe.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Szybkie przepisy</h1>
          <p className="mt-1 text-muted-foreground">
            Gotowe szablony promptów do typowych zadań - wystarczy wypełnić puste miejsca
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Szukaj przepisów po nazwie, opisie lub technice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            containerClassName="flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{filteredRecipes.length} przepisów</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const count = recipeCounts[category] || 0;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  'border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-accent'
                )}
              >
                {category === 'all' ? 'Wszystkie' : CATEGORY_LABELS[category]}
                <Badge
                  variant={isSelected ? 'secondary' : 'outline'}
                  className="ml-1 h-5 min-w-[1.25rem] px-1.5"
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Recipes grid with AnimatePresence */}
        <AnimatePresence mode="popLayout">
          {filteredRecipes.length > 0 ? (
            <motion.div
              key="recipes-grid"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              layout={!reducedMotion}
            >
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
                  exit={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.2,
                    delay: reducedMotion ? 0 : getStaggerDelay(index, 0.03),
                    layout: { duration: 0.3 },
                  }}
                >
                  <QuickRecipeCard
                    recipe={recipe}
                    onClick={handleUseRecipe}
                    showDetails
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
              exit={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    Nie znaleziono przepisów
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Spróbuj dostosować kryteria wyszukiwania lub filtrowania
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Wyczyść filtry
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Twórz własne przepisy
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Zapisuj swoje ulubione prompty jako własne przepisy do szybkiego dostępu.
                  Przejdź do dowolnego zapisanego prompta i kliknij "Zapisz jako przepis", aby dodać go do
                  swojej kolekcji. Własne przepisy pojawią się tutaj obok
                  wbudowanych szablonów.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Dowiedz się więcej
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

QuickRecipesPage.displayName = 'QuickRecipesPage';
