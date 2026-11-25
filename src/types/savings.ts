/** Icon keys a goal can use; mapped to Lucide icons in the UI (icon picker on design 27). */
export type SavingsGoalIcon =
  'shield' | 'laptop' | 'plane' | 'house' | 'graduation-cap' | 'gift' | 'car';

/** How often money moves into a goal automatically (design 27). */
export type AutoSaveFrequency = 'weekly' | 'monthly' | 'manual';

export type AutoSave = {
  frequency: AutoSaveFrequency;
  /** Naira per period; 0 when manual. */
  amount: number;
};

export type SavingsContributionKind = 'auto-save' | 'top-up' | 'interest';

/** A deposit into a goal, listed under "Contributions" (design 28). */
export type SavingsContribution = {
  id: string;
  kind: SavingsContributionKind;
  /** Naira. */
  amount: number;
  /** ISO 8601 date-time. */
  date: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  icon: SavingsGoalIcon;
  saved: number;
  target: number;
  /** ISO 8601 date the goal should be reached by. */
  targetDate: string;
  autoSave: AutoSave;
  /** Newest first. */
  contributions: SavingsContribution[];
};

/** A goal template offered under "Suggested for you" (design 26). */
export type SavingsSuggestion = {
  id: string;
  name: string;
  icon: SavingsGoalIcon;
};

/** Account money can be moved from into a goal (design 29). */
export type FundingSourceId = 'acc_demo_001' | 'acc_demo_003';
