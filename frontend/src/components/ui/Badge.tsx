import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'slate' | 'green' | 'blue' | 'amber' | 'red' | 'violet';

const tones: Record<Tone, string> = {
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
  blue: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-400',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  red: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400',
};

export function Badge({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
