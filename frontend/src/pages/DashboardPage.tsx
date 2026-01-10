import { type FC, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Wand2,
  BookOpen,
  Star,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  useToast,
  PromptCardSkeleton,
  StatCardSkeleton,
} from '@/components/ui';
import { PromptCard } from '@/components/display';
import { useAuthStore, usePromptStore } from '@/stores';
import { staggerContainer, staggerItem, prefersReducedMotion } from '@/lib/animations';
import type { Prompt } from '@/types';

interface QuickActionProps {
  title: string;
  description: string;
  icon: FC<{ className?: string }>;
  href: string;
  color: string;
}

const QuickAction: FC<QuickActionProps> = ({
  title,
  description,
  icon: Icon,
  href,
  color,
}) => {
  return (
    <Link to={href}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="p-6">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${color} transition-transform group-hover:scale-105`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-3 flex items-center text-sm font-medium text-primary">
            Rozpocznij
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: FC<{ className?: string }>;
  color: string;
  description?: string;
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground/70">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const reducedMotion = prefersReducedMotion();

  const user = useAuthStore((state) => state.user);
  const prompts = usePromptStore((state) => state.prompts);
  const isLoading = usePromptStore((state) => state.isLoading);
  const loadPrompts = usePromptStore((state) => state.loadPrompts);
  const deletePrompt = usePromptStore((state) => state.deletePrompt);
  const toggleFavorite = usePromptStore((state) => state.toggleFavorite);

  useEffect(() => {
    loadPrompts().catch(() => {
      // Error is handled by the store
    });
  }, [loadPrompts]);

  // Computed values
  const stats = useMemo(() => {
    const totalPrompts = prompts.length;
    const favoriteCount = prompts.filter((p) => p.isFavorite).length;
    const recentCount = prompts.slice(0, 5).length;

    // Count prompts created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = prompts.filter(
      (p) => new Date(p.createdAt) > oneWeekAgo
    ).length;

    return { totalPrompts, favoriteCount, recentCount, thisWeekCount };
  }, [prompts]);

  const recentPrompts = useMemo(() => prompts.slice(0, 6), [prompts]);
  const favoritePrompts = useMemo(
    () => prompts.filter((p) => p.isFavorite).slice(0, 3),
    [prompts]
  );

  const handleViewPrompt = useCallback(
    (prompt: Prompt) => {
      navigate(`/prompt/${prompt.id}`);
    },
    [navigate]
  );

  const handleDeletePrompt = useCallback(
    async (prompt: Prompt) => {
      try {
        await deletePrompt(prompt.id);
        toast.success('Usunięto', 'Prompt został usunięty.');
      } catch (error) {
        toast.error('Błąd', (error as Error).message);
      }
    },
    [deletePrompt, toast]
  );

  const handleToggleFavorite = useCallback(
    async (prompt: Prompt) => {
      try {
        await toggleFavorite(prompt.id);
        toast.success(
          prompt.isFavorite ? 'Usunięto z ulubionych' : 'Dodano do ulubionych'
        );
      } catch (error) {
        toast.error('Błąd', (error as Error).message);
      }
    },
    [toggleFavorite, toast]
  );

  const handleCopyPrompt = useCallback(
    (_prompt: Prompt) => {
      void _prompt; // Used to identify which prompt was copied
      toast.success('Skopiowano!', 'Prompt skopiowany do schowka.');
    },
    [toast]
  );

  const quickActions: QuickActionProps[] = [
    {
      title: 'Utwórz prompt',
      description: 'Generuj zoptymalizowane prompty dla dowolnego modelu AI',
      icon: PenTool,
      href: '/create',
      color: 'bg-primary',
    },
    {
      title: 'Optymalizuj',
      description: 'Ulepsz istniejące prompty dla lepszych rezultatów',
      icon: Wand2,
      href: '/optimize',
      color: 'bg-blue-500',
    },
    {
      title: 'Szybkie przepisy',
      description: 'Użyj gotowych szablonów do typowych zadań',
      icon: BookOpen,
      href: '/recipes',
      color: 'bg-green-500',
    },
  ];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dzień dobry';
    if (hour < 18) return 'Dzień dobry';
    return 'Dobry wieczór';
  }, []);

  // Animation wrapper component
  const MotionDiv = reducedMotion ? 'div' : motion.div;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, {user?.name?.split(' ')[0] || 'Użytkowniku'}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              {prompts.length > 0
                ? 'Gotowy do tworzenia niesamowitych promptów?'
                : 'Zacznijmy od Twojego pierwszego prompta!'}
            </p>
          </div>
          <Link to="/create">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Nowy prompt
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="stats-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <MotionDiv
              key="stats"
              {...(!reducedMotion && {
                variants: staggerContainer,
                initial: 'initial',
                animate: 'animate',
              })}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <MotionDiv {...(!reducedMotion && { variants: staggerItem })}>
                <StatCard
                  title="Wszystkie prompty"
                  value={stats.totalPrompts}
                  icon={TrendingUp}
                  color="bg-primary/10 text-primary"
                />
              </MotionDiv>
              <MotionDiv {...(!reducedMotion && { variants: staggerItem })}>
                <StatCard
                  title="Ulubione"
                  value={stats.favoriteCount}
                  icon={Star}
                  color="bg-yellow-500/10 text-yellow-500"
                />
              </MotionDiv>
              <MotionDiv {...(!reducedMotion && { variants: staggerItem })}>
                <StatCard
                  title="W tym tygodniu"
                  value={stats.thisWeekCount}
                  icon={Clock}
                  color="bg-blue-500/10 text-blue-500"
                  description="utworzonych promptów"
                />
              </MotionDiv>
              <MotionDiv {...(!reducedMotion && { variants: staggerItem })}>
                <StatCard
                  title="Ostatnie"
                  value={stats.recentCount}
                  icon={Sparkles}
                  color="bg-green-500/10 text-green-500"
                  description="najnowsze prompty"
                />
              </MotionDiv>
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Quick actions */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Szybkie akcje
          </h2>
          <MotionDiv
            {...(!reducedMotion && {
              variants: staggerContainer,
              initial: 'initial',
              animate: 'animate',
            })}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {quickActions.map((action) => (
              <MotionDiv
                key={action.href}
                {...(!reducedMotion && { variants: staggerItem })}
              >
                <QuickAction {...action} />
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>

        {/* Favorites section */}
        <AnimatePresence>
          {favoritePrompts.length > 0 && (
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -20 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  <Star className="mr-2 inline h-5 w-5 fill-yellow-500 text-yellow-500" />
                  Ulubione
                </h2>
              </div>
              <MotionDiv
                {...(!reducedMotion && {
                  variants: staggerContainer,
                  initial: 'initial',
                  animate: 'animate',
                })}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {favoritePrompts.map((prompt) => (
                  <MotionDiv
                    key={prompt.id}
                    {...(!reducedMotion && { variants: staggerItem })}
                  >
                    <PromptCard
                      prompt={prompt}
                      onView={handleViewPrompt}
                      onDelete={handleDeletePrompt}
                      onToggleFavorite={handleToggleFavorite}
                      onCopy={handleCopyPrompt}
                      compact
                    />
                  </MotionDiv>
                ))}
              </MotionDiv>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent prompts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Ostatnie prompty
            </h2>
            {prompts.length > 6 && (
              <Link to="/prompts">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Zobacz wszystkie
                </Button>
              </Link>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="prompts-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[...Array(6)].map((_, i) => (
                  <PromptCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : recentPrompts.length > 0 ? (
              <MotionDiv
                key="prompts"
                {...(!reducedMotion && {
                  variants: staggerContainer,
                  initial: 'initial',
                  animate: 'animate',
                })}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {recentPrompts.map((prompt) => (
                  <MotionDiv
                    key={prompt.id}
                    {...(!reducedMotion && { variants: staggerItem })}
                  >
                    <PromptCard
                      prompt={prompt}
                      onView={handleViewPrompt}
                      onDelete={handleDeletePrompt}
                      onToggleFavorite={handleToggleFavorite}
                      onCopy={handleCopyPrompt}
                    />
                  </MotionDiv>
                ))}
              </MotionDiv>
            ) : (
              <motion.div
                key="empty"
                initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <PenTool className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-foreground">
                      Brak promptów
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Utwórz swój pierwszy prompt, aby rozpocząć. Nasze AI pomoże Ci
                      wygenerować zoptymalizowane prompty do każdego zadania.
                    </p>
                    <Link to="/create">
                      <Button className="mt-6" leftIcon={<Plus className="h-4 w-4" />}>
                        Utwórz swój pierwszy prompt
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Getting Started Tips - Only show for new users */}
        {prompts.length === 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Jak zacząć</CardTitle>
            </CardHeader>
            <CardContent>
              <MotionDiv
                {...(!reducedMotion && {
                  variants: staggerContainer,
                  initial: 'initial',
                  animate: 'animate',
                })}
                className="grid gap-6 sm:grid-cols-3"
              >
                <MotionDiv
                  {...(!reducedMotion && { variants: staggerItem })}
                  className="space-y-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <h4 className="font-medium text-foreground">Utwórz prompt</h4>
                  <p className="text-sm text-muted-foreground">
                    Opisz, co chcesz osiągnąć i wybierz docelowy model AI.
                  </p>
                </MotionDiv>
                <MotionDiv
                  {...(!reducedMotion && { variants: staggerItem })}
                  className="space-y-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <h4 className="font-medium text-foreground">Otrzymaj wersje</h4>
                  <p className="text-sm text-muted-foreground">
                    Otrzymaj wersję rozszerzoną, standardową i minimalną swojego prompta.
                  </p>
                </MotionDiv>
                <MotionDiv
                  {...(!reducedMotion && { variants: staggerItem })}
                  className="space-y-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <h4 className="font-medium text-foreground">Używaj i zapisuj</h4>
                  <p className="text-sm text-muted-foreground">
                    Kopiuj prompty do użycia z modelami AI lub zapisz je w swojej bibliotece.
                  </p>
                </MotionDiv>
              </MotionDiv>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

DashboardPage.displayName = 'DashboardPage';
