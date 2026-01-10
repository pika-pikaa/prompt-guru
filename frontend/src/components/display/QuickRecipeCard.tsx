import { type FC } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  FileText,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuickRecipe, RecipeCategory, AIModel } from '@/types';
import { AI_MODEL_LABELS } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from '@/components/ui';
import { subtleCardHover, iconHover, prefersReducedMotion } from '@/lib/animations';

interface QuickRecipeCardProps {
  recipe: QuickRecipe;
  onClick?: (recipe: QuickRecipe) => void;
  showDetails?: boolean;
  className?: string;
}

const CATEGORY_ICONS: Record<RecipeCategory, FC<{ className?: string }>> = {
  writing: FileText,
  coding: Code,
  analysis: Search,
  creative: Lightbulb,
  business: Briefcase,
  education: GraduationCap,
  research: BookOpen,
};

const CATEGORY_COLORS: Record<RecipeCategory, string> = {
  writing: 'bg-blue-500',
  coding: 'bg-green-500',
  analysis: 'bg-purple-500',
  creative: 'bg-pink-500',
  business: 'bg-orange-500',
  education: 'bg-cyan-500',
  research: 'bg-indigo-500',
};

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  writing: 'Pisanie',
  coding: 'Programowanie',
  analysis: 'Analiza',
  creative: 'Kreatywne',
  business: 'Biznes',
  education: 'Edukacja',
  research: 'Badania',
};

export const QuickRecipeCard: FC<QuickRecipeCardProps> = ({
  recipe,
  onClick,
  showDetails = true,
  className,
}) => {
  const Icon = CATEGORY_ICONS[recipe.category] || BookOpen;
  const color = CATEGORY_COLORS[recipe.category] || 'bg-gray-500';
  const categoryLabel = CATEGORY_LABELS[recipe.category] || recipe.category;
  const reducedMotion = prefersReducedMotion();
  const cardHoverProps = reducedMotion ? {} : subtleCardHover;
  const iconHoverProps = reducedMotion ? {} : iconHover;

  return (
    <motion.div {...cardHoverProps}>
      <Card
        className={cn(
          'group transition-all',
          onClick && 'cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50',
          className
        )}
        onClick={() => onClick?.(recipe)}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(recipe);
          }
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <motion.div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                color
              )}
              {...iconHoverProps}
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <Badge variant="outline" className="shrink-0">
              {categoryLabel}
            </Badge>
          </div>
          <CardTitle className="mt-3 text-lg">{recipe.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {recipe.description}
          </CardDescription>
        </CardHeader>

      <CardContent className="space-y-4">
        {/* Recommended Models */}
        {showDetails && recipe.recommendedModels && recipe.recommendedModels.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Polecane:
            </span>
            <div className="flex flex-wrap gap-1">
              {recipe.recommendedModels.slice(0, 2).map((model) => (
                <Badge key={model} variant="secondary" className="text-xs">
                  {AI_MODEL_LABELS[model as AIModel] || model}
                </Badge>
              ))}
              {recipe.recommendedModels.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{recipe.recommendedModels.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Techniques */}
        {showDetails && recipe.techniques && recipe.techniques.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.techniques.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {recipe.techniques.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.techniques.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        {onClick && (
          <Button
            className="w-full"
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="h-4 w-4" />}
            rightIcon={
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            }
            onClick={(e) => {
              e.stopPropagation();
              onClick(recipe);
            }}
          >
            Użyj przepisu
          </Button>
        )}
      </CardContent>
      </Card>
    </motion.div>
  );
};

QuickRecipeCard.displayName = 'QuickRecipeCard';
