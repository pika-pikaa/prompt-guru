import { type FC, useState, useMemo, useCallback, useEffect } from 'react';
import { Copy, Check, ArrowLeftRight, Columns, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';

// Hook do detekcji mobile
const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

type ViewMode = 'side-by-side' | 'inline' | 'unified';

interface DiffViewerProps {
  originalText: string;
  optimizedText: string;
  improvements?: string[];
  originalTokenCount?: number;
  optimizedTokenCount?: number;
  onCopy?: (text: string) => void;
  className?: string;
}

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  content: string;
  lineNumber: { original?: number; optimized?: number };
}

// Simple diff algorithm for line-by-line comparison
const computeDiff = (original: string, optimized: string): DiffLine[] => {
  const originalLines = original.split('\n');
  const optimizedLines = optimized.split('\n');
  const result: DiffLine[] = [];

  let i = 0;
  let j = 0;
  let originalLineNum = 1;
  let optimizedLineNum = 1;

  while (i < originalLines.length || j < optimizedLines.length) {
    const originalLine = originalLines[i];
    const optimizedLine = optimizedLines[j];

    if (i >= originalLines.length) {
      // Only optimized lines left
      result.push({
        type: 'added',
        content: optimizedLine,
        lineNumber: { optimized: optimizedLineNum++ },
      });
      j++;
    } else if (j >= optimizedLines.length) {
      // Only original lines left
      result.push({
        type: 'removed',
        content: originalLine,
        lineNumber: { original: originalLineNum++ },
      });
      i++;
    } else if (originalLine === optimizedLine) {
      // Lines are the same
      result.push({
        type: 'unchanged',
        content: originalLine,
        lineNumber: { original: originalLineNum++, optimized: optimizedLineNum++ },
      });
      i++;
      j++;
    } else {
      // Lines differ - check if it's an edit, addition, or removal
      const nextOriginalMatch = optimizedLines.slice(j).indexOf(originalLine);
      const nextOptimizedMatch = originalLines.slice(i).indexOf(optimizedLine);

      if (nextOriginalMatch !== -1 && (nextOptimizedMatch === -1 || nextOriginalMatch <= nextOptimizedMatch)) {
        // Current optimized line is an addition
        result.push({
          type: 'added',
          content: optimizedLine,
          lineNumber: { optimized: optimizedLineNum++ },
        });
        j++;
      } else if (nextOptimizedMatch !== -1) {
        // Current original line is a removal
        result.push({
          type: 'removed',
          content: originalLine,
          lineNumber: { original: originalLineNum++ },
        });
        i++;
      } else {
        // Both lines changed - show as removal then addition
        result.push({
          type: 'removed',
          content: originalLine,
          lineNumber: { original: originalLineNum++ },
        });
        result.push({
          type: 'added',
          content: optimizedLine,
          lineNumber: { optimized: optimizedLineNum++ },
        });
        i++;
        j++;
      }
    }
  }

  return result;
};

const LineContent: FC<{
  line: DiffLine;
  showLineNumbers?: boolean;
  mode: ViewMode;
}> = ({ line, showLineNumbers = true, mode }) => {
  const bgClass =
    line.type === 'added'
      ? 'bg-green-50 dark:bg-green-950/30'
      : line.type === 'removed'
      ? 'bg-red-50 dark:bg-red-950/30'
      : '';

  const textClass =
    line.type === 'added'
      ? 'text-green-700 dark:text-green-300'
      : line.type === 'removed'
      ? 'text-red-700 dark:text-red-300'
      : 'text-foreground';

  const prefix =
    line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';

  return (
    <div className={cn('flex', bgClass)}>
      {showLineNumbers && (
        <span className="w-12 shrink-0 select-none border-r border-border px-2 py-0.5 text-right text-xs text-muted-foreground">
          {line.lineNumber.original || line.lineNumber.optimized || ''}
        </span>
      )}
      <span className={cn('flex-1 px-2 py-0.5 text-sm font-mono', textClass)}>
        {mode === 'unified' && <span className="select-none">{prefix}</span>}
        {line.content || '\u00A0'}
      </span>
    </div>
  );
};

export const DiffViewer: FC<DiffViewerProps> = ({
  originalText,
  optimizedText,
  improvements = [],
  originalTokenCount,
  optimizedTokenCount,
  onCopy,
  className,
}) => {
  const isMobile = useIsMobile();
  const [viewModeState, setViewModeState] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'unified' : 'side-by-side'
  );
  const [copiedSide, setCopiedSide] = useState<'original' | 'optimized' | null>(null);

  // Derive effective view mode - force unified on mobile
  const viewMode = isMobile ? 'unified' : viewModeState;
  const setViewMode = (mode: ViewMode) => {
    if (!isMobile) {
      setViewModeState(mode);
    }
  };

  const diff = useMemo(
    () => computeDiff(originalText, optimizedText),
    [originalText, optimizedText]
  );

  const stats = useMemo(() => {
    const additions = diff.filter((l) => l.type === 'added').length;
    const removals = diff.filter((l) => l.type === 'removed').length;
    const unchanged = diff.filter((l) => l.type === 'unchanged').length;
    return { additions, removals, unchanged };
  }, [diff]);

  const tokenDiff = useMemo(() => {
    if (originalTokenCount === undefined || optimizedTokenCount === undefined) {
      return null;
    }
    const diff = optimizedTokenCount - originalTokenCount;
    const percentage = Math.round((diff / originalTokenCount) * 100);
    return { diff, percentage };
  }, [originalTokenCount, optimizedTokenCount]);

  const handleCopy = useCallback(
    async (text: string, side: 'original' | 'optimized') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedSide(side);
        onCopy?.(text);
        setTimeout(() => setCopiedSide(null), 2000);
      } catch {
        // Error is handled by parent
      }
    },
    [onCopy]
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Porównanie</CardTitle>
          <div className="flex items-center gap-2">
            {/* Ukryj przycisk "Obok siebie" na mobile */}
            <Button
              variant={viewMode === 'side-by-side' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('side-by-side')}
              leftIcon={<Columns className="h-4 w-4" />}
              className="hidden md:flex"
            >
              Obok siebie
            </Button>
            <Button
              variant={viewMode === 'unified' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('unified')}
              leftIcon={<FileText className="h-4 w-4" />}
            >
              Zunifikowany
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">+{stats.additions} dodano</Badge>
          <Badge variant="error">-{stats.removals} usunięto</Badge>
          <Badge variant="secondary">{stats.unchanged} bez zmian</Badge>
          {tokenDiff && (
            <Badge
              variant={tokenDiff.diff <= 0 ? 'success' : 'warning'}
            >
              {tokenDiff.diff > 0 ? '+' : ''}{tokenDiff.diff} tokens ({tokenDiff.percentage > 0 ? '+' : ''}{tokenDiff.percentage}%)
            </Badge>
          )}
        </div>

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
              Zastosowane ulepszenia:
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {improvements.map((improvement, index) => (
                <Badge key={index} variant="success" className="text-xs">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Diff View */}
        {viewMode === 'side-by-side' ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Original */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Oryginał
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(originalText, 'original')}
                  leftIcon={
                    copiedSide === 'original' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )
                  }
                >
                  {copiedSide === 'original' ? 'Skopiowano' : 'Kopiuj'}
                </Button>
              </div>
              <div className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 touch-pan-y overscroll-contain">
                {diff
                  .filter((l) => l.type !== 'added')
                  .map((line, index) => (
                    <LineContent
                      key={index}
                      line={line}
                      mode="side-by-side"
                    />
                  ))}
              </div>
            </div>

            {/* Optimized */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Zoptymalizowany
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(optimizedText, 'optimized')}
                  leftIcon={
                    copiedSide === 'optimized' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )
                  }
                >
                  {copiedSide === 'optimized' ? 'Skopiowano' : 'Kopiuj'}
                </Button>
              </div>
              <div className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 touch-pan-y overscroll-contain">
                {diff
                  .filter((l) => l.type !== 'removed')
                  .map((line, index) => (
                    <LineContent
                      key={index}
                      line={line}
                      mode="side-by-side"
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Unified View */
          <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowLeftRight className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">Zmiany z oryginału do zoptymalizowanego</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(optimizedText, 'optimized')}
                leftIcon={
                  copiedSide === 'optimized' ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )
                }
                className="shrink-0"
              >
                <span className="hidden sm:inline">Kopiuj zoptymalizowany</span>
                <span className="sm:hidden">Kopiuj</span>
              </Button>
            </div>
            <div className="max-h-[500px] overflow-auto rounded-lg border border-border bg-muted/30 touch-pan-y overscroll-contain -webkit-overflow-scrolling-touch">
              {diff.map((line, index) => (
                <LineContent key={index} line={line} mode="unified" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

DiffViewer.displayName = 'DiffViewer';
