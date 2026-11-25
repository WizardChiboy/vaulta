import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { savingsGoals } from '@/mock/savings';
import type { AutoSave, SavingsGoal, SavingsGoalIcon } from '@/types/savings';

export type NewGoalInput = {
  name: string;
  icon: SavingsGoalIcon;
  target: number;
  targetDate: string;
  autoSave: AutoSave;
};

/**
 * Savings goals, shared by Savings (26), New goal (27), Goal details (28) and
 * Add money (29), plus the target date picked on the date sheet for the New goal form.
 * Mock: starts from fictional data and lives in memory.
 */
type SavingsContextValue = {
  goals: SavingsGoal[];
  getGoal: (id: string) => SavingsGoal | undefined;
  createGoal: (input: NewGoalInput) => SavingsGoal;
  /** Records a manual top-up and returns the updated goal. */
  addMoney: (goalId: string, amount: number) => SavingsGoal | undefined;
  /** Target date chosen on the date sheet, read by New goal (27). */
  draftTargetDate: string | null;
  setDraftTargetDate: (iso: string | null) => void;
};

const SavingsContext = createContext<SavingsContextValue | null>(null);

export function SavingsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState(savingsGoals);
  const [draftTargetDate, setDraftTargetDate] = useState<string | null>(null);

  const getGoal = useCallback((id: string) => goals.find((goal) => goal.id === id), [goals]);

  const createGoal = useCallback((input: NewGoalInput) => {
    const goal: SavingsGoal = {
      ...input,
      id: `goal_local_${Date.now()}`,
      saved: 0,
      contributions: [],
    };
    setGoals((previous) => [...previous, goal]);
    return goal;
  }, []);

  const addMoney = useCallback(
    (goalId: string, amount: number) => {
      const goal = goals.find((item) => item.id === goalId);
      if (!goal || amount <= 0) return undefined;
      const updated: SavingsGoal = {
        ...goal,
        saved: goal.saved + amount,
        contributions: [
          {
            id: `ctb_local_${Date.now()}`,
            kind: 'top-up',
            amount,
            date: new Date().toISOString(),
          },
          ...goal.contributions,
        ],
      };
      setGoals((previous) => previous.map((item) => (item.id === goalId ? updated : item)));
      return updated;
    },
    [goals]
  );

  const value = useMemo(
    () => ({ goals, getGoal, createGoal, addMoney, draftTargetDate, setDraftTargetDate }),
    [goals, getGoal, createGoal, addMoney, draftTargetDate]
  );

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>;
}

export function useSavings() {
  const value = useContext(SavingsContext);
  if (!value) throw new Error('useSavings must be used inside <SavingsProvider>');
  return value;
}
