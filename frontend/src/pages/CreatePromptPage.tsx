import { type FC, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  useToast,
} from '@/components/ui';
import {
  ModelSelector,
  PromptForm,
  type PromptFormData,
} from '@/components/forms';
import { PromptOutput } from '@/components/display';
import { usePromptStore, useAuthStore } from '@/stores';
import { AIModel, PROMPT_TECHNIQUES, type PromptVersion } from '@/types';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/animations';
import type { QuickRecipe } from '@/types';

type PageMode = 'quick' | 'advanced';

/**
 * Animated progress indicator component for generation state
 */
interface GeneratingIndicatorProps {
  isVisible: boolean;
}

const GeneratingIndicator: FC<GeneratingIndicatorProps> = ({ isVisible }) => {
  const [progress, setProgress] = useState(0);
  const reducedMotion = prefersReducedMotion();

  // Reset progress when component becomes invisible
  // This is intentional - we want to reset UI state when hiding the indicator
  useEffect(() => {
    if (!isVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    // Simulate progress with easing - never reaches 100% until complete
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // Exponential decay - progress slows as it approaches 90%
        const increment = (90 - prev) * 0.05;
        return Math.min(prev + increment, 90);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="border-primary/50 bg-primary/5 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Animated Sparkles icon */}
                <motion.div
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: 360,
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    Generowanie promptów...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI optymalizuje Twój prompt dla wybranego modelu
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Progress percentage */}
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Przetwarzanie...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CreatePromptPage: FC = () => {
  const location = useLocation();
  const recipe = (location.state as { recipe?: QuickRecipe })?.recipe;

  const [pageMode, setPageMode] = useState<PageMode>('quick');
  const [topic, setTopic] = useState(recipe?.template || '');
  const [context, setContext] = useState('');
  const [targetModel, setTargetModel] = useState<AIModel>(
    recipe?.recommendedModels?.[0] as AIModel || AIModel.CLAUDE_4
  );
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(
    recipe?.techniques || []
  );

  const generatedVersions = usePromptStore((state) => state.generatedVersions);
  const isGenerating = usePromptStore((state) => state.isGenerating);
  const isSaving = usePromptStore((state) => state.isSaving);
  const generatePrompt = usePromptStore((state) => state.generatePrompt);
  const savePrompt = usePromptStore((state) => state.savePrompt);
  const clearGeneratedVersions = usePromptStore(
    (state) => state.clearGeneratedVersions
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const toast = useToast();

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      clearGeneratedVersions();
    };
  }, [clearGeneratedVersions]);

  const handleTechniqueToggle = useCallback((techniqueId: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(techniqueId)
        ? prev.filter((id) => id !== techniqueId)
        : [...prev, techniqueId]
    );
  }, []);

  const handleQuickGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Wymagany temat', 'Wprowadź temat dla swojego prompta.');
      return;
    }

    try {
      await generatePrompt(topic, context, targetModel, selectedTechniques);
      toast.success('Prompty wygenerowane!', 'Twoje zoptymalizowane prompty są gotowe.');
    } catch (error) {
      toast.error('Generowanie nie powiodło się', (error as Error).message);
    }
  }, [topic, context, targetModel, selectedTechniques, generatePrompt, toast]);

  const handleAdvancedGenerate = useCallback(
    async (data: PromptFormData, techniques: string[]) => {
      try {
        const combinedContext = [data.context, data.constraints]
          .filter(Boolean)
          .join('\n\n');

        await generatePrompt(data.goal, combinedContext, data.model, techniques);
        toast.success('Prompty wygenerowane!', 'Twoje zoptymalizowane prompty są gotowe.');
      } catch (error) {
        toast.error('Generowanie nie powiodło się', (error as Error).message);
      }
    },
    [generatePrompt, toast]
  );

  const handleCopy = useCallback(() => {
    toast.success('Skopiowano!', 'Prompt skopiowany do schowka.');
  }, [toast]);

  const handleSave = useCallback(
    async (version: PromptVersion) => {
      if (!isAuthenticated) {
        toast.warning(
          'Wymagane zalogowanie',
          'Zaloguj się, aby zapisywać prompty.'
        );
        return;
      }

      try {
        await savePrompt({
          title: `${topic} - ${version.type}`,
          topic,
          context,
          targetModel,
          versions: [version],
          tags: selectedTechniques,
        });
        toast.success('Zapisano!', 'Prompt zapisany w Twojej bibliotece.');
      } catch (error) {
        toast.error('Zapisywanie nie powiodło się', (error as Error).message);
      }
    },
    [
      isAuthenticated,
      topic,
      context,
      targetModel,
      selectedTechniques,
      savePrompt,
      toast,
    ]
  );

  const handleReset = useCallback(() => {
    setTopic('');
    setContext('');
    setTargetModel(AIModel.CLAUDE_4);
    setSelectedTechniques([]);
    clearGeneratedVersions();
  }, [clearGeneratedVersions]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Utwórz prompt</h1>
            <p className="mt-1 text-muted-foreground">
              Generuj zoptymalizowane prompty dostosowane do docelowego modelu AI
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setPageMode('quick')}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                pageMode === 'quick'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Tryb szybki
            </button>
            <button
              type="button"
              onClick={() => setPageMode('advanced')}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                pageMode === 'advanced'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Zaawansowany
            </button>
          </div>
        </div>

        {/* Recipe Banner */}
        {recipe && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Używany przepis: {recipe.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {recipe.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
              >
                Wyczyść przepis
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generating Progress Indicator */}
        <GeneratingIndicator isVisible={isGenerating} />

        {pageMode === 'quick' ? (
          /* Quick Mode Layout */
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Szczegóły prompta</CardTitle>
                  <CardDescription>
                    Opisz, w czym AI ma Ci pomóc
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Temat / Cel"
                    placeholder="np. Napisz opis produktu dla..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                    helperText="Bądź konkretny co do tego, co chcesz osiągnąć"
                  />

                  <Textarea
                    label="Kontekst (opcjonalnie)"
                    placeholder="Podaj dodatkowy kontekst, wymagania lub ograniczenia..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    showCharacterCount
                    maxCharacters={2000}
                    autoResize
                    disabled={isGenerating}
                  />

                  <ModelSelector
                    value={targetModel}
                    onChange={setTargetModel}
                    showDescription={false}
                    disabled={isGenerating}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      className="flex-1"
                      isLoading={isGenerating}
                      onClick={handleQuickGenerate}
                      leftIcon={<Sparkles className="h-4 w-4" />}
                    >
                      Generuj prompty
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isGenerating}
                    >
                      Resetuj
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Techniques */}
              <Card>
                <CardHeader>
                  <CardTitle>Techniki</CardTitle>
                  <CardDescription>
                    Wybierz techniki, aby ulepszyć swoje prompty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_TECHNIQUES.map((technique) => (
                      <button
                        key={technique.id}
                        type="button"
                        onClick={() => handleTechniqueToggle(technique.id)}
                        disabled={isGenerating}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                          'border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                          'disabled:pointer-events-none disabled:opacity-50',
                          selectedTechniques.includes(technique.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:bg-accent'
                        )}
                        title={technique.description}
                      >
                        {technique.name}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output */}
            <div>
              <PromptOutput
                versions={generatedVersions}
                isLoading={isGenerating}
                onCopy={handleCopy}
                onSave={isAuthenticated ? handleSave : undefined}
                isSaving={isSaving}
                showTips={generatedVersions.length > 0}
              />
            </div>
          </div>
        ) : (
          /* Advanced Mode Layout */
          <div className="grid gap-8 lg:grid-cols-2">
            <PromptForm
              onSubmit={handleAdvancedGenerate}
              isLoading={isGenerating}
              initialData={{
                goal: topic,
                model: targetModel,
                context,
              }}
              defaultMode="full"
            />

            <PromptOutput
              versions={generatedVersions}
              isLoading={isGenerating}
              onCopy={handleCopy}
              onSave={isAuthenticated ? handleSave : undefined}
              isSaving={isSaving}
              showTips={generatedVersions.length > 0}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

CreatePromptPage.displayName = 'CreatePromptPage';
