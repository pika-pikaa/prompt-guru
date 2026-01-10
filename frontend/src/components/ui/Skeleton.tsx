import { type FC, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/animations';
import { Card, CardContent } from './Card';

// ============================================
// BAZOWY SKELETON
// ============================================

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Szerokość szkieletu */
  width?: string | number;
  /** Wysokość szkieletu */
  height?: string | number;
  /** Zaokrąglenie - 'none' | 'sm' | 'md' | 'lg' | 'full' */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Włącza efekt shimmer */
  animate?: boolean;
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * Bazowy komponent Skeleton z animacją shimmer
 */
export const Skeleton: FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = 'md',
  animate = true,
  style,
  ...props
}) => {
  const shouldAnimate = animate && !prefersReducedMotion();

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        roundedStyles[rounded],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
          animate={{
            translateX: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

// ============================================
// SKELETON DLA TEKSTU
// ============================================

interface SkeletonTextProps {
  /** Liczba linii tekstu */
  lines?: number;
  /** Ostatnia linia krótsza */
  lastLineWidth?: string;
  className?: string;
}

/**
 * Skeleton dla bloków tekstowych
 */
export const SkeletonText: FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = '60%',
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          className={index === lines - 1 ? `w-[${lastLineWidth}]` : 'w-full'}
          rounded="sm"
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

// ============================================
// SKELETON DLA KARTY PROMPTA
// ============================================

interface PromptCardSkeletonProps {
  /** Kompaktowy widok */
  compact?: boolean;
  className?: string;
}

/**
 * Skeleton dla komponentu PromptCard
 */
export const PromptCardSkeleton: FC<PromptCardSkeletonProps> = ({
  compact = false,
  className
}) => {
  if (compact) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-5 w-20" rounded="full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 space-y-4">
        {/* Header z badge i ikoną */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-8 w-8 shrink-0" rounded="md" />
        </div>

        {/* Model badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-24" rounded="full" />
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
        </div>

        {/* Tagi */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-14" rounded="full" />
          <Skeleton className="h-5 w-18" rounded="full" />
          <Skeleton className="h-5 w-12" rounded="full" />
        </div>

        {/* Footer z datą */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" rounded="full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" rounded="md" />
            <Skeleton className="h-8 w-8" rounded="md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

PromptCardSkeleton.displayName = 'PromptCardSkeleton';

// ============================================
// SKELETON DLA KARTY STATYSTYK
// ============================================

interface StatCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton dla komponentu StatCard
 */
export const StatCardSkeleton: FC<StatCardSkeletonProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-6">
        <Skeleton className="h-12 w-12 shrink-0" rounded="lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-16" rounded="full" />
      </CardContent>
    </Card>
  );
};

StatCardSkeleton.displayName = 'StatCardSkeleton';

// ============================================
// SKELETON DLA QUICK RECIPE CARD
// ============================================

interface QuickRecipeCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton dla komponentu QuickRecipeCard
 */
export const QuickRecipeCardSkeleton: FC<QuickRecipeCardSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 shrink-0" rounded="lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20" rounded="full" />
          <Skeleton className="h-5 w-16" rounded="full" />
        </div>
      </CardContent>
    </Card>
  );
};

QuickRecipeCardSkeleton.displayName = 'QuickRecipeCardSkeleton';

// ============================================
// SKELETON DLA LISTY
// ============================================

interface SkeletonListProps {
  /** Liczba elementów */
  count?: number;
  /** Typ elementu listy */
  itemType?: 'card' | 'row' | 'compact';
  className?: string;
}

/**
 * Skeleton dla listy elementów
 */
export const SkeletonList: FC<SkeletonListProps> = ({
  count = 3,
  itemType = 'row',
  className,
}) => {
  if (itemType === 'card') {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <PromptCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (itemType === 'compact') {
    return (
      <div className={cn('grid gap-3 md:grid-cols-2', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <PromptCardSkeleton key={index} compact />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <Skeleton className="h-12 w-12" rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-8 w-20" rounded="md" />
        </div>
      ))}
    </div>
  );
};

SkeletonList.displayName = 'SkeletonList';

// ============================================
// PROGRESS SKELETON
// ============================================

interface ProgressSkeletonProps {
  /** Wartość postępu (0-100) */
  progress?: number;
  /** Tryb nieokreślony */
  indeterminate?: boolean;
  className?: string;
}

/**
 * Skeleton dla paska postępu z animowanym wypełnieniem
 */
export const ProgressSkeleton: FC<ProgressSkeletonProps> = ({
  progress = 0,
  indeterminate = false,
  className,
}) => {
  const shouldAnimate = !prefersReducedMotion();

  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-muted',
        className
      )}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {indeterminate ? (
        <motion.div
          className="h-full w-1/3 rounded-full bg-primary"
          animate={
            shouldAnimate
              ? {
                  x: ['-100%', '400%'],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ) : (
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      )}
    </div>
  );
};

ProgressSkeleton.displayName = 'ProgressSkeleton';

// ============================================
// SKELETON DLA FORMULARZA
// ============================================

interface FormSkeletonProps {
  /** Liczba pól */
  fields?: number;
  /** Pokazuj przycisk submit */
  showButton?: boolean;
  className?: string;
}

/**
 * Skeleton dla formularzy
 */
export const FormSkeleton: FC<FormSkeletonProps> = ({
  fields = 3,
  showButton = true,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          {/* Label */}
          <Skeleton className="h-4 w-24" rounded="sm" />
          {/* Input */}
          <Skeleton className="h-10 w-full" rounded="md" />
        </div>
      ))}

      {showButton && (
        <Skeleton className="h-10 w-28 mt-4" rounded="md" />
      )}
    </div>
  );
};

FormSkeleton.displayName = 'FormSkeleton';

// ============================================
// AVATAR SKELETON
// ============================================

interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Skeleton dla awatara
 */
export const AvatarSkeleton: FC<AvatarSkeletonProps> = ({
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <Skeleton
      className={cn(sizeStyles[size], className)}
      rounded="full"
    />
  );
};

AvatarSkeleton.displayName = 'AvatarSkeleton';
