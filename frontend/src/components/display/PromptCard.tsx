import { type FC, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Copy,
  Check,
  Trash2,
  MoreVertical,
  ExternalLink,
  Edit2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, truncateText } from '@/lib/utils';
import type { Prompt, AIModel } from '@/types';
import { AI_MODEL_LABELS } from '@/types';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Modal,
  ModalFooter,
} from '@/components/ui';
import { cardHoverAnimation, prefersReducedMotion } from '@/lib/animations';

interface PromptCardProps {
  prompt: Prompt;
  onView?: (prompt: Prompt) => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  onCopy?: (prompt: Prompt) => void;
  onToggleFavorite?: (prompt: Prompt) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export const PromptCard: FC<PromptCardProps> = ({
  prompt,
  onView: _onView,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
  showActions = true,
  compact = false,
  className,
}) => {
  void _onView; // Reserved for future use
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const content = prompt.versions?.[0]?.content || prompt.topic;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy?.(prompt);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Error handling
    }
  }, [prompt, onCopy]);

  const handleDelete = useCallback(() => {
    onDelete?.(prompt);
    setShowDeleteModal(false);
  }, [prompt, onDelete]);

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite?.(prompt);
    },
    [prompt, onToggleFavorite]
  );

  const versionCount = prompt.versions?.length || 0;
  const primaryVersion = prompt.versions?.[0];
  const modelLabel =
    AI_MODEL_LABELS[prompt.targetModel as AIModel] || prompt.targetModel;

  const reducedMotion = prefersReducedMotion();
  const hoverProps = reducedMotion ? {} : cardHoverAnimation;

  if (compact) {
    return (
      <Link to={`/prompt/${prompt.id}`}>
        <motion.div {...hoverProps}>
          <Card
            className={cn(
              'group transition-all hover:shadow-md hover:border-primary/50',
              className
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {prompt.title || prompt.topic}
                    </h3>
                    {prompt.isFavorite && (
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    {truncateText(prompt.topic, 80)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {modelLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(prompt.createdAt)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    );
  }

  return (
    <>
      <motion.div {...hoverProps}>
        <Card
          className={cn(
            'group relative transition-all hover:shadow-md',
            className
          )}
        >
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to={`/prompt/${prompt.id}`}
                  className="font-semibold text-foreground hover:text-primary truncate"
                >
                  {prompt.title || prompt.topic}
                </Link>
                {prompt.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {prompt.description || prompt.topic}
              </p>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Więcej akcji"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-border bg-card py-1 shadow-lg">
                      <Link
                        to={`/prompt/${prompt.id}`}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setShowMenu(false)}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Zobacz szczegóły
                      </Link>
                      {onEdit && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                          onClick={() => {
                            setShowMenu(false);
                            onEdit(prompt);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edytuj
                        </button>
                      )}
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => {
                          setShowMenu(false);
                          handleCopy();
                        }}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied ? 'Skopiowano!' : 'Kopiuj prompt'}
                      </button>
                      {onToggleFavorite && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
                          onClick={(e) => {
                            setShowMenu(false);
                            handleToggleFavorite(e);
                          }}
                        >
                          <Star
                            className={cn(
                              'h-4 w-4',
                              prompt.isFavorite && 'fill-yellow-500 text-yellow-500'
                            )}
                          />
                          {prompt.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                        </button>
                      )}
                      {onDelete && (
                        <>
                          <div className="my-1 border-t border-border" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setShowMenu(false);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Usuń
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{modelLabel}</Badge>
            {versionCount > 0 && (
              <Badge variant="outline">
                {versionCount} {versionCount === 1 ? 'wersja' : versionCount < 5 ? 'wersje' : 'wersji'}
              </Badge>
            )}
            {primaryVersion?.type && (
              <Badge variant="outline" className="capitalize">
                {primaryVersion.type}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {prompt.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 4 && (
                <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  +{prompt.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(prompt.createdAt)}</span>
          </div>
        </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Usuń prompt"
        description="Czy na pewno chcesz usunąć ten prompt? Tej akcji nie można cofnąć."
      >
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Usuń
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

PromptCard.displayName = 'PromptCard';
