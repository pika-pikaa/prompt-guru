import { type FC, useCallback, useId } from 'react';
import { FileText, Layers, Minimize2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VersionType } from '@/types';

type VersionOption = VersionType | 'all';

interface VersionInfo {
  id: VersionOption;
  name: string;
  description: string;
  icon: FC<{ className?: string }>;
}

const VERSION_OPTIONS: VersionInfo[] = [
  {
    id: 'extended',
    name: 'Rozszerzona',
    description: 'Pełne szczegóły z kompleksowymi instrukcjami i przykładami',
    icon: Layers,
  },
  {
    id: 'standard',
    name: 'Standardowa',
    description: 'Zrównoważone podejście z niezbędnym kontekstem i jasnością',
    icon: FileText,
  },
  {
    id: 'minimal',
    name: 'Minimalna',
    description: 'Zwięzłe prompty skupione tylko na podstawowych wymaganiach',
    icon: Minimize2,
  },
  {
    id: 'all',
    name: 'Wszystkie wersje',
    description: 'Generuj wszystkie trzy wersje do porównania',
    icon: LayoutGrid,
  },
];

interface VersionSelectorProps {
  value: VersionOption;
  onChange: (version: VersionOption) => void;
  disabled?: boolean;
  showAllOption?: boolean;
  variant?: 'tabs' | 'cards';
  className?: string;
}

export const VersionSelector: FC<VersionSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  showAllOption = true,
  variant = 'tabs',
  className,
}) => {
  const groupId = useId();

  const handleSelect = useCallback(
    (version: VersionOption) => {
      if (!disabled) {
        onChange(version);
      }
    },
    [disabled, onChange]
  );

  const options = showAllOption
    ? VERSION_OPTIONS
    : VERSION_OPTIONS.filter((opt) => opt.id !== 'all');

  if (variant === 'cards') {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="block text-sm font-medium text-foreground">
          Typ wersji
        </label>
        <div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          role="radiogroup"
          aria-label="Wybierz typ wersji"
        >
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = value === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'flex flex-col items-center rounded-lg border p-4 text-center transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span className="mt-2 font-medium text-foreground">
                  {option.name}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Tabs variant (default)
  return (
    <div className={cn('space-y-2', className)}>
      <label
        id={`${groupId}-label`}
        className="block text-sm font-medium text-foreground"
      >
        Typ wersji
      </label>
      <div
        className="inline-flex rounded-lg bg-muted p-1"
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
      >
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => handleSelect(option.id)}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                isSelected
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title={option.description}
            >
              {option.name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {options.find((opt) => opt.id === value)?.description}
      </p>
    </div>
  );
};

VersionSelector.displayName = 'VersionSelector';
