import { type FC, useState, useCallback, useEffect } from 'react';
import { Copy, Check, Wand2, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  useToast,
  Spinner,
} from '@/components/ui';
import { OptimizeForm, type OptimizeFormData } from '@/components/forms';
import { DiffViewer } from '@/components/display';
import { usePromptStore } from '@/stores';
import { cn } from '@/lib/utils';

export const OptimizePage: FC = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const optimizedPrompt = usePromptStore((state) => state.optimizedPrompt);
  const optimizationImprovements = usePromptStore(
    (state) => state.optimizationImprovements
  );
  const isOptimizing = usePromptStore((state) => state.isOptimizing);
  const optimizePrompt = usePromptStore((state) => state.optimizePrompt);
  const clearOptimizedPrompt = usePromptStore(
    (state) => state.clearOptimizedPrompt
  );

  const toast = useToast();

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      clearOptimizedPrompt();
    };
  }, [clearOptimizedPrompt]);

  const handleOptimize = useCallback(
    async (data: OptimizeFormData) => {
      setOriginalPrompt(data.originalPrompt);

      try {
        await optimizePrompt(data.originalPrompt, data.targetModel);
        toast.success('Optymalizacja zakończona!', 'Twój prompt został ulepszony.');
      } catch (error) {
        toast.error('Optymalizacja nie powiodła się', (error as Error).message);
      }
    },
    [optimizePrompt, toast]
  );

  const handleCopy = useCallback(async () => {
    if (!optimizedPrompt) return;

    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      toast.success('Skopiowano!', 'Zoptymalizowany prompt skopiowany do schowka.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Kopiowanie nie powiodło się', 'Nie udało się skopiować do schowka.');
    }
  }, [optimizedPrompt, toast]);

  const handleUseOptimized = useCallback(() => {
    if (optimizedPrompt) {
      setOriginalPrompt(optimizedPrompt);
      clearOptimizedPrompt();
      toast.info('Prompt zaktualizowany', 'Możesz teraz dalej go optymalizować.');
    }
  }, [optimizedPrompt, clearOptimizedPrompt, toast]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Optymalizuj prompt</h1>
          <p className="mt-1 text-muted-foreground">
            Ulepsz swoje istniejące prompty dla lepszych rezultatów z dowolnym modelem AI
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <OptimizeForm
            onSubmit={handleOptimize}
            isLoading={isOptimizing}
            initialPrompt={originalPrompt}
          />

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle>Zoptymalizowany wynik</CardTitle>
              <CardDescription>
                {optimizedPrompt
                  ? 'Twój ulepszony prompt z zastosowanymi optymalizacjami'
                  : 'Zoptymalizowana wersja pojawi się tutaj'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOptimizing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="lg" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Analizowanie i optymalizowanie Twojego prompta...
                  </p>
                </div>
              ) : optimizedPrompt ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                      {optimizedPrompt}
                    </pre>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      leftIcon={
                        copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )
                      }
                    >
                      {copied ? 'Skopiowano' : 'Kopiuj'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleUseOptimized}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Użyj jako dane wejściowe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wand2 className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    Gotowy do optymalizacji
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Wklej swój prompt i kliknij "Optymalizuj", aby go ulepszyć
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Diff Viewer - Only show when we have both original and optimized */}
        {optimizedPrompt && originalPrompt && (
          <DiffViewer
            originalText={originalPrompt}
            optimizedText={optimizedPrompt}
            improvements={optimizationImprovements}
            onCopy={(_text) => toast.success('Skopiowano!', 'Tekst skopiowany do schowka.')}
          />
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Wskazówki optymalizacji</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Bądź konkretny',
                  description:
                    'Uwzględnij jasny kontekst i wymagania dla lepszych wyników optymalizacji.',
                },
                {
                  title: 'Iteruj',
                  description:
                    'Uruchom kilka przebiegów optymalizacji, aby dalej udoskonalić swój prompt.',
                },
                {
                  title: 'Wybierz odpowiedni model',
                  description:
                    'Różne modele lepiej reagują na różne style promptów.',
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-lg border border-border p-4',
                    'bg-gradient-to-br from-primary/5 to-transparent'
                  )}
                >
                  <h4 className="font-medium text-foreground">{tip.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

OptimizePage.displayName = 'OptimizePage';
