import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  floatingBlob,
  floatingBlobAlt,
  prefersReducedMotion,
} from '@/lib/animations';

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children, className }) => {
  const reduceMotion = prefersReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated gradient blobs */}
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
            {...floatingBlob}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
            {...floatingBlobAlt}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Static blobs for reduced motion */}
      {reduceMotion && (
        <>
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        </>
      )}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          className="mb-8 flex items-center gap-2"
          initial={reduceMotion ? undefined : { opacity: 0, y: -20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary glow">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prompt Guru</h1>
            <p className="text-sm text-muted-foreground">Tworzenie promptów AI</p>
          </div>
        </motion.div>

        {/* Card with glassmorphism */}
        <motion.div
          className={cn(
            'glass w-full max-w-md rounded-xl p-8',
            className
          )}
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Twórz zoptymalizowane prompty dla dowolnego modelu AI
        </motion.p>
      </div>
    </div>
  );
};

AuthLayout.displayName = 'AuthLayout';
