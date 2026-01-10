import { type FC, useState, useCallback, type FormEvent } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIModel, PROMPT_TECHNIQUES } from '@/types';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui';
import { ModelSelector } from './ModelSelector';

type TaskType = 'system_prompt' | 'task_prompt' | 'image_prompt' | 'search_query';

interface PromptFormData {
  goal: string;
  model: AIModel;
  taskType: TaskType;
  context: string;
  tone: string;
  constraints: string;
  outputFormat: string;
}

interface PromptFormProps {
  onSubmit: (data: PromptFormData, techniques: string[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<PromptFormData>;
  defaultMode?: 'quick' | 'full';
  className?: string;
}

const TASK_TYPE_OPTIONS = [
  { value: 'system_prompt', label: 'Prompt systemowy' },
  { value: 'task_prompt', label: 'Prompt zadaniowy' },
  { value: 'image_prompt', label: 'Prompt do obrazu' },
  { value: 'search_query', label: 'Zapytanie wyszukiwania' },
];

const TONE_OPTIONS = [
  { value: '', label: 'Wybierz ton (opcjonalnie)' },
  { value: 'professional', label: 'Profesjonalny' },
  { value: 'casual', label: 'Swobodny' },
  { value: 'formal', label: 'Formalny' },
  { value: 'friendly', label: 'Przyjazny' },
  { value: 'technical', label: 'Techniczny' },
  { value: 'creative', label: 'Kreatywny' },
];

const OUTPUT_FORMAT_OPTIONS = [
  { value: '', label: 'Wybierz format (opcjonalnie)' },
  { value: 'text', label: 'Zwykły tekst' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'bullet_points', label: 'Lista punktowana' },
  { value: 'numbered_list', label: 'Lista numerowana' },
  { value: 'code', label: 'Kod' },
];

const DEFAULT_FORM_DATA: PromptFormData = {
  goal: '',
  model: AIModel.CLAUDE_4,
  taskType: 'task_prompt',
  context: '',
  tone: '',
  constraints: '',
  outputFormat: '',
};

export const PromptForm: FC<PromptFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  defaultMode = 'quick',
  className,
}) => {
  const [mode, setMode] = useState<'quick' | 'full'>(defaultMode);
  const [formData, setFormData] = useState<PromptFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof PromptFormData, string>>>({});

  const updateField = useCallback(
    <K extends keyof PromptFormData>(field: K, value: PromptFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleTechniqueToggle = useCallback((techniqueId: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(techniqueId)
        ? prev.filter((id) => id !== techniqueId)
        : [...prev, techniqueId]
    );
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof PromptFormData, string>> = {};

    if (!formData.goal.trim()) {
      newErrors.goal = 'Cel jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.goal]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      await onSubmit(formData, selectedTechniques);
    },
    [formData, selectedTechniques, onSubmit, validate]
  );

  const handleReset = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setSelectedTechniques([]);
    setErrors({});
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'quick' ? 'full' : 'quick'));
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Szczegóły prompta</CardTitle>
            <CardDescription>
              {mode === 'quick'
                ? 'Tryb szybki: Tylko podstawowe pola'
                : 'Tryb pełny: Wszystkie opcje personalizacji'}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            rightIcon={mode === 'quick' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          >
            {mode === 'quick' ? 'Pokaż więcej' : 'Pokaż mniej'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal - Always visible */}
          <Input
            label="Cel"
            placeholder="W czym AI ma Ci pomóc?"
            value={formData.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            error={errors.goal}
            disabled={isLoading}
            helperText="Bądź konkretny co do tego, co chcesz osiągnąć"
          />

          {/* Task Type - Always visible */}
          <Select
            label="Typ zadania"
            options={TASK_TYPE_OPTIONS}
            value={formData.taskType}
            onChange={(e) => updateField('taskType', e.target.value as TaskType)}
            disabled={isLoading}
            helperText="Wybierz typ prompta, którego potrzebujesz"
          />

          {/* Model Selector - Always visible */}
          <ModelSelector
            value={formData.model}
            onChange={(model) => updateField('model', model)}
            showDescription={mode === 'full'}
            disabled={isLoading}
          />

          {/* Extended fields - Only in full mode */}
          {mode === 'full' && (
            <>
              <Textarea
                label="Kontekst"
                placeholder="Podaj informacje tła, wymagania lub ograniczenia..."
                value={formData.context}
                onChange={(e) => updateField('context', e.target.value)}
                disabled={isLoading}
                showCharacterCount
                maxCharacters={2000}
                autoResize
                helperText="Dodatkowy kontekst pomaga generować dokładniejsze prompty"
              />

              <Select
                label="Ton"
                options={TONE_OPTIONS}
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                disabled={isLoading}
              />

              <Textarea
                label="Ograniczenia"
                placeholder="Określ wszelkie ograniczenia lub wymagania (np. liczba słów, ograniczenia formatu)..."
                value={formData.constraints}
                onChange={(e) => updateField('constraints', e.target.value)}
                disabled={isLoading}
                autoResize
              />

              <Select
                label="Format wyjściowy"
                options={OUTPUT_FORMAT_OPTIONS}
                value={formData.outputFormat}
                onChange={(e) => updateField('outputFormat', e.target.value)}
                disabled={isLoading}
              />

              {/* Techniques */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Techniki promptowania
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_TECHNIQUES.map((technique) => (
                    <button
                      key={technique.id}
                      type="button"
                      onClick={() => handleTechniqueToggle(technique.id)}
                      disabled={isLoading}
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
                <p className="text-xs text-muted-foreground">
                  Wybierz techniki, aby ulepszyć jakość prompta
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generuj prompty
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

PromptForm.displayName = 'PromptForm';

export type { PromptFormData, TaskType };
