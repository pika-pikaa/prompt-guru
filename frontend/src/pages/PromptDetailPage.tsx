import { type FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Star,
  Trash2,
  Clock,
  Sparkles,
  Edit2,
  Share2,
  BookmarkPlus,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  ModalFooter,
  Spinner,
  useToast,
} from '@/components/ui';
import { usePromptStore } from '@/stores';
import { formatDateTime, cn } from '@/lib/utils';
import { AI_MODEL_LABELS, type AIModel, type VersionType } from '@/types';

const VERSION_LABELS: Record<VersionType, string> = {
  extended: 'Rozszerzona',
  standard: 'Standardowa',
  minimal: 'Minimalna',
};

const VERSION_DESCRIPTIONS: Record<VersionType, string> = {
  extended: 'Kompleksowa wersja ze szczegółowymi instrukcjami i przykładami',
  standard: 'Zrównoważona wersja z niezbędnym kontekstem i jasnością',
  minimal: 'Zwięzła wersja skupiona na podstawowych wymaganiach',
};

export const PromptDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPrompt = usePromptStore((state) => state.currentPrompt);
  const isLoading = usePromptStore((state) => state.isLoading);
  const loadPromptById = usePromptStore((state) => state.loadPromptById);
  const deletePrompt = usePromptStore((state) => state.deletePrompt);
  const toggleFavorite = usePromptStore((state) => state.toggleFavorite);
  const setCurrentPrompt = usePromptStore((state) => state.setCurrentPrompt);

  useEffect(() => {
    if (id) {
      loadPromptById(id).catch(() => {
        toast.error('Błąd', 'Nie udało się załadować prompta');
        navigate('/dashboard');
      });
    }

    // Cleanup on unmount
    return () => {
      setCurrentPrompt(null);
    };
  }, [id, loadPromptById, navigate, toast, setCurrentPrompt]);

  const handleCopy = useCallback(
    async (content: string, index: number) => {
      try {
        await navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        toast.success('Skopiowano!', 'Prompt skopiowany do schowka.');
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch {
        toast.error('Kopiowanie nie powiodło się', 'Nie udało się skopiować do schowka.');
      }
    },
    [toast]
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const handleToggleFavorite = useCallback(async () => {
    if (!id) return;
    try {
      await toggleFavorite(id);
      toast.success(
        currentPrompt?.isFavorite ? 'Usunięto z ulubionych' : 'Dodano do ulubionych',
        currentPrompt?.isFavorite
          ? 'Prompt usunięty z Twoich ulubionych'
          : 'Prompt dodany do Twoich ulubionych'
      );
    } catch (error) {
      toast.error('Błąd', (error as Error).message);
    }
  }, [id, currentPrompt?.isFavorite, toggleFavorite, toast]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deletePrompt(id);
      toast.success('Usunięto', 'Prompt został usunięty.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Błąd', (error as Error).message);
      setIsDeleting(false);
    }
  }, [id, deletePrompt, navigate, toast]);

  const handleShare = useCallback(async () => {
    if (!currentPrompt) return;

    const shareText = `Sprawdź ten prompt: ${currentPrompt.title || currentPrompt.topic}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPrompt.title || 'Prompt Guru Prompt',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link skopiowany!', 'Link do udostępnienia skopiowany do schowka.');
      } catch {
        toast.error('Udostępnianie nie powiodło się', 'Nie udało się udostępnić prompta.');
      }
    }
  }, [currentPrompt, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!currentPrompt) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Sparkles className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Nie znaleziono prompta
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Prompt, którego szukasz, nie istnieje lub mógł zostać usunięty.
          </p>
          <Link to="/dashboard">
            <Button className="mt-6">Wróć do panelu głównego</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const modelLabel =
    AI_MODEL_LABELS[currentPrompt.targetModel as AIModel] ||
    currentPrompt.targetModel;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back button and actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Wróć
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              Udostępnij
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              leftIcon={
                <Star
                  className={cn(
                    'h-4 w-4',
                    currentPrompt.isFavorite && 'fill-yellow-500 text-yellow-500'
                  )}
                />
              }
            >
              {currentPrompt.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BookmarkPlus className="h-4 w-4" />}
            >
              Zapisz jako przepis
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Usuń
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {currentPrompt.title || currentPrompt.topic}
            </h1>
            {currentPrompt.isFavorite && (
              <Star className="mt-2 h-6 w-6 shrink-0 fill-yellow-500 text-yellow-500" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {modelLabel}
            </Badge>
            {currentPrompt.versions && currentPrompt.versions.length > 0 && (
              <Badge variant="outline">
                {currentPrompt.versions.length} wersj{currentPrompt.versions.length === 1 ? 'a' : currentPrompt.versions.length < 5 ? 'e' : 'i'}
              </Badge>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatDateTime(currentPrompt.createdAt)}
            </div>
          </div>
        </div>

        {/* Topic and context */}
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-foreground">Temat</h4>
              <p className="mt-1.5 text-muted-foreground">{currentPrompt.topic}</p>
            </div>

            {currentPrompt.context && (
              <div>
                <h4 className="text-sm font-medium text-foreground">Kontekst</h4>
                <p className="mt-1.5 whitespace-pre-wrap text-muted-foreground">
                  {currentPrompt.context}
                </p>
              </div>
            )}

            {currentPrompt.description && currentPrompt.description !== currentPrompt.topic && (
              <div>
                <h4 className="text-sm font-medium text-foreground">Opis</h4>
                <p className="mt-1.5 text-muted-foreground">
                  {currentPrompt.description}
                </p>
              </div>
            )}

            {currentPrompt.tags && currentPrompt.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Użyte techniki
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentPrompt.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Versions */}
        {currentPrompt.versions && currentPrompt.versions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Wersje prompta</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={currentPrompt.versions[0]?.type || 'standard'}>
                <TabsList className="w-full justify-start">
                  {currentPrompt.versions.map((version) => (
                    <TabsTrigger key={version.type} value={version.type}>
                      {VERSION_LABELS[version.type]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {currentPrompt.versions.map((version, index) => (
                  <TabsContent key={version.type} value={version.type}>
                    <div className="space-y-4">
                      {/* Version Description */}
                      <p className="text-sm text-muted-foreground">
                        {VERSION_DESCRIPTIONS[version.type]}
                      </p>

                      {/* Prompt Content */}
                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                          {version.content}
                        </pre>
                      </div>

                      {/* Version Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {version.tokenCount} tokenów
                          </Badge>
                          {version.techniques &&
                            version.techniques.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          {version.techniques && version.techniques.length > 3 && (
                            <Badge variant="secondary">
                              +{version.techniques.length - 3} więcej
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(version.content, index)}
                            leftIcon={
                              copiedIndex === index ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )
                            }
                          >
                            {copiedIndex === index ? 'Skopiowano' : 'Kopiuj'}
                          </Button>
                          <Link
                            to="/optimize"
                            state={{ prompt: version.content }}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<Edit2 className="h-4 w-4" />}
                            >
                              Optymalizuj
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-foreground">Szybkie akcje</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/create" state={{ topic: currentPrompt.topic }}>
                <Button variant="outline" className="w-full justify-start">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Utwórz podobny
                </Button>
              </Link>
              <Link
                to="/optimize"
                state={{ prompt: currentPrompt.versions?.[0]?.content }}
              >
                <Button variant="outline" className="w-full justify-start">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Optymalizuj
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Udostępnij
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  handleCopy(
                    currentPrompt.versions?.[0]?.content || currentPrompt.topic,
                    -1
                  )
                }
              >
                {copiedIndex === -1 ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copiedIndex === -1 ? 'Skopiowano!' : 'Kopiuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Usuń prompt"
        description="Czy na pewno chcesz usunąć ten prompt? Tej akcji nie można cofnąć i wszystkie wersje zostaną trwale usunięte."
      >
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Anuluj
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Usuń prompt
          </Button>
        </ModalFooter>
      </Modal>
    </MainLayout>
  );
};

PromptDetailPage.displayName = 'PromptDetailPage';
