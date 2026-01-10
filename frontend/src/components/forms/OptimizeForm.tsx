import { type FC, useState, useCallback, type FormEvent } from 'react';
import { Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIModel } from '@/types';
import {
  Button,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui';
import { ModelSelector } from './ModelSelector';

type OptimizationIssue =
  | 'clarity'
  | 'specificity'
  | 'structure'
  | 'context'
  | 'examples'
  | 'constraints';

interface OptimizeFormData {
  originalPrompt: string;
  targetModel: AIModel;
  selectedIssues: OptimizationIssue[];
}

interface OptimizeFormProps {
  onSubmit: (data: OptimizeFormData) => Promise<void>;
  isLoading?: boolean;
  initialPrompt?: string;
  className?: string;
}

const OPTIMIZATION_ISSUES: { id: OptimizationIssue; label: string; description: string }[] = [
  {
    id: 'clarity',
    label: 'Klarowność',
    description: 'Popraw czytelność i zrozumiałość',
  },
  {
    id: 'specificity',
    label: 'Precyzja',
    description: 'Dodaj bardziej precyzyjne instrukcje',
  },
  {
    id: 'structure',
    label: 'Struktura',
    description: 'Lepsza organizacja i przepływ',
  },
  {
    id: 'context',
    label: 'Kontekst',
    description: 'Dodaj istotne informacje tła',
  },
  {
    id: 'examples',
    label: 'Przykłady',
    description: 'Dołącz pomocne przykłady',
  },
  {
    id: 'constraints',
    label: 'Ograniczenia',
    description: 'Zdefiniuj jaśniejsze granice',
  },
];

export const OptimizeForm: FC<OptimizeFormProps> = ({
  onSubmit,
  isLoading = false,
  initialPrompt = '',
  className,
}) => {
  const [formData, setFormData] = useState<OptimizeFormData>({
    originalPrompt: initialPrompt,
    targetModel: AIModel.CLAUDE_4,
    selectedIssues: [],
  });
  const [error, setError] = useState<string | null>(null);

  const handleIssueToggle = useCallback((issue: OptimizationIssue) => {
    setFormData((prev) => ({
      ...prev,
      selectedIssues: prev.selectedIssues.includes(issue)
        ? prev.selectedIssues.filter((i) => i !== issue)
        : [...prev.selectedIssues, issue],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!formData.originalPrompt.trim()) {
        setError('Wprowadź prompt do optymalizacji');
        return;
      }

      await onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const handleReset = useCallback(() => {
    setFormData({
      originalPrompt: '',
      targetModel: AIModel.CLAUDE_4,
      selectedIssues: [],
    });
    setError(null);
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Oryginalny prompt</CardTitle>
        <CardDescription>
          Wklej prompt, który chcesz zoptymalizować dla lepszych wyników
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Original Prompt */}
          <div className="space-y-2">
            <Textarea
              placeholder="Wprowadź swój prompt tutaj..."
              value={formData.originalPrompt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  originalPrompt: e.target.value,
                }))
              }
              disabled={isLoading}
              showCharacterCount
              autoResize
              className="min-h-[200px] font-mono"
              error={error ?? undefined}
            />
          </div>

          {/* Model Selector */}
          <ModelSelector
            value={formData.targetModel}
            onChange={(model) =>
              setFormData((prev) => ({ ...prev, targetModel: model }))
            }
            showDescription={false}
            disabled={isLoading}
          />

          {/* Optional Issues */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Obszary fokusowe (opcjonalnie)
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Wybierz konkretne obszary do poprawy lub pozostaw puste dla ogólnej optymalizacji
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {OPTIMIZATION_ISSUES.map((issue) => {
                const isSelected = formData.selectedIssues.includes(issue.id);
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => handleIssueToggle(issue.id)}
                    disabled={isLoading}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 text-left transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:pointer-events-none disabled:opacity-50',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {issue.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {issue.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
              leftIcon={<Wand2 className="h-4 w-4" />}
            >
              Optymalizuj prompt
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Resetuj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

OptimizeForm.displayName = 'OptimizeForm';

export type { OptimizeFormData, OptimizationIssue };
