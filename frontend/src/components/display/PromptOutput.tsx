import { type FC, useState, useCallback, useMemo } from 'react';
import { Copy, Check, Save, Lightbulb, Code, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PromptVersion, VersionType } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Spinner,
} from '@/components/ui';

interface PromptOutputProps {
  versions: PromptVersion[];
  isLoading?: boolean;
  onCopy?: (content: string, versionType: VersionType) => void;
  onSave?: (version: PromptVersion) => void;
  isSaving?: boolean;
  showTips?: boolean;
  className?: string;
}

const VERSION_LABELS: Record<VersionType, string> = {
  extended: 'Rozszerzona',
  standard: 'Standardowa',
  minimal: 'Minimalna',
};

const TIPS = [
  {
    icon: Code,
    title: 'Testuj iteracyjnie',
    description: 'Wypróbuj różne wersje i dostosuj na podstawie odpowiedzi modelu',
  },
  {
    icon: Hash,
    title: 'Użyj liczby tokenów',
    description: 'Weź pod uwagę limity tokenów docelowego modelu przy wyborze wersji',
  },
  {
    icon: Lightbulb,
    title: 'Dostosuj dalej',
    description: 'Użyj wygenerowanych promptów jako punktu wyjścia i dopracuj według potrzeb',
  },
];

// Simple syntax highlighting for code blocks in prompts
const highlightContent = (content: string): React.ReactNode => {
  // Check if content contains code-like patterns
  const codeBlockRegex = /```[\s\S]*?```/g;
  const hasCodeBlocks = codeBlockRegex.test(content);

  if (!hasCodeBlocks) {
    return content;
  }

  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and code
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
      if (match) {
        const [, language, code] = match;
        return (
          <div key={index} className="my-2 rounded-md bg-zinc-900 dark:bg-zinc-950">
            {language && (
              <div className="border-b border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                {language}
              </div>
            )}
            <pre className="overflow-x-auto p-3 text-sm text-zinc-100">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
};

export const PromptOutput: FC<PromptOutputProps> = ({
  versions,
  isLoading = false,
  onCopy,
  onSave,
  isSaving = false,
  showTips = true,
  className,
}) => {
  const [copiedType, setCopiedType] = useState<VersionType | null>(null);

  const handleCopy = useCallback(
    async (content: string, versionType: VersionType) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedType(versionType);
        onCopy?.(content, versionType);
        setTimeout(() => setCopiedType(null), 2000);
      } catch {
        // Error handling is done by parent
      }
    },
    [onCopy]
  );

  const defaultVersion = useMemo(() => {
    if (versions.length === 0) return 'standard';
    return versions[0].type;
  }, [versions]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">
            Generowanie zoptymalizowanych promptów...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Wygenerowane prompty</CardTitle>
          <CardDescription>
            Twoje wygenerowane prompty pojawią się tutaj
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Gotowy do generowania
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Wypełnij formularz i kliknij "Generuj prompty", aby utworzyć zoptymalizowane prompty dla docelowego modelu AI
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Generated Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Wygenerowane prompty</CardTitle>
          <CardDescription>
            Wybierz wersję, która najlepiej odpowiada Twoim potrzebom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultVersion}>
            <TabsList className="w-full">
              {versions.map((version) => (
                <TabsTrigger
                  key={version.type}
                  value={version.type}
                  className="flex-1"
                >
                  {VERSION_LABELS[version.type]}
                </TabsTrigger>
              ))}
            </TabsList>

            {versions.map((version) => (
              <TabsContent key={version.type} value={version.type}>
                <div className="space-y-4">
                  {/* Prompt Content */}
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                      {highlightContent(version.content)}
                    </pre>
                  </div>

                  {/* Metadata and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {version.tokenCount} tokenów
                      </Badge>
                      {version.techniques.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                      {version.techniques.length > 3 && (
                        <Badge variant="secondary">
                          +{version.techniques.length - 3} więcej
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(version.content, version.type)}
                        leftIcon={
                          copiedType === version.type ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )
                        }
                      >
                        {copiedType === version.type ? 'Skopiowano' : 'Kopiuj'}
                      </Button>
                      {onSave && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onSave(version)}
                          isLoading={isSaving}
                          leftIcon={<Save className="h-4 w-4" />}
                        >
                          Zapisz
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Tips Section */}
      {showTips && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wskazówki dla lepszych wyników</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {TIPS.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {tip.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

PromptOutput.displayName = 'PromptOutput';
