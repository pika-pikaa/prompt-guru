import { type FC, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  Gem,
  Banana,
  Sun,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIModel, AI_MODEL_LABELS } from '@/types';
import { Badge } from '@/components/ui';

type ModelCategory = 'LLM' | 'Image' | 'Search';

interface ModelInfo {
  id: AIModel;
  name: string;
  description: string;
  category: ModelCategory;
  icon: FC<{ className?: string }>;
  color: string;
}

const MODEL_INFO: ModelInfo[] = [
  {
    id: AIModel.CLAUDE_4,
    name: AI_MODEL_LABELS[AIModel.CLAUDE_4],
    description: 'Zaawansowane rozumowanie i analiza z wyjątkową obsługą kontekstu',
    category: 'LLM',
    icon: Brain,
    color: 'bg-orange-500',
  },
  {
    id: AIModel.GPT_5,
    name: AI_MODEL_LABELS[AIModel.GPT_5],
    description: 'Potężny model językowy z szeroką bazą wiedzy',
    category: 'LLM',
    icon: Sparkles,
    color: 'bg-green-500',
  },
  {
    id: AIModel.GROK_4,
    name: AI_MODEL_LABELS[AIModel.GROK_4],
    description: 'Wiedza w czasie rzeczywistym z bezpośrednimi odpowiedziami',
    category: 'LLM',
    icon: Zap,
    color: 'bg-blue-500',
  },
  {
    id: AIModel.GEMINI_3,
    name: AI_MODEL_LABELS[AIModel.GEMINI_3],
    description: 'Multimodalne AI z silnymi zdolnościami rozumowania',
    category: 'LLM',
    icon: Gem,
    color: 'bg-purple-500',
  },
  {
    id: AIModel.NANO_BANANA,
    name: AI_MODEL_LABELS[AIModel.NANO_BANANA],
    description: 'Lekki model zoptymalizowany do szybkich zadań',
    category: 'LLM',
    icon: Banana,
    color: 'bg-yellow-500',
  },
  {
    id: AIModel.GROK_AURORA,
    name: AI_MODEL_LABELS[AIModel.GROK_AURORA],
    description: 'Zaawansowane generowanie obrazów z artystycznym zacięciem',
    category: 'Image',
    icon: Sun,
    color: 'bg-pink-500',
  },
  {
    id: AIModel.PERPLEXITY_PRO,
    name: AI_MODEL_LABELS[AIModel.PERPLEXITY_PRO],
    description: 'Głębokie badania z kompleksowym wyszukiwaniem w sieci',
    category: 'Search',
    icon: Search,
    color: 'bg-cyan-500',
  },
];

const CATEGORY_COLORS: Record<ModelCategory, string> = {
  LLM: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  Image: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
  Search: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
};

const CATEGORY_LABELS: Record<ModelCategory, string> = {
  LLM: 'LLM',
  Image: 'Obraz',
  Search: 'Wyszukiwanie',
};

interface ModelSelectorProps {
  value: AIModel;
  onChange: (model: AIModel) => void;
  showDescription?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ModelSelector: FC<ModelSelectorProps> = ({
  value,
  onChange,
  showDescription = true,
  disabled = false,
  className,
}) => {
  const handleSelect = useCallback(
    (model: AIModel) => {
      if (!disabled) {
        onChange(model);
      }
    },
    [disabled, onChange]
  );

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-foreground">
        Docelowy model AI
      </label>
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="radiogroup"
        aria-label="Wybierz model AI"
      >
        {MODEL_INFO.map((model) => {
          const Icon = model.icon;
          const isSelected = value === model.id;

          return (
            <button
              key={model.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => handleSelect(model.id)}
              className={cn(
                'relative flex flex-col items-start rounded-lg border p-4 text-left transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
              )}
            >
              <div className="flex w-full items-start justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    model.color
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <Badge
                  className={cn('text-xs', CATEGORY_COLORS[model.category])}
                >
                  {CATEGORY_LABELS[model.category]}
                </Badge>
              </div>

              <h3 className="mt-3 font-medium text-foreground">{model.name}</h3>

              {showDescription && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {model.description}
                </p>
              )}

              {isSelected && (
                <div
                  className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

ModelSelector.displayName = 'ModelSelector';
