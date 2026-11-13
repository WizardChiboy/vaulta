/** Icon keys a goal can use; mapped to Lucide icons in the UI (icon picker on design 27). */
export type SavingsGoalIcon = 'shield' | 'laptop' | 'plane' | 'house' | 'graduation-cap' | 'gift';

export type SavingsGoal = {
  id: string;
  name: string;
  icon: SavingsGoalIcon;
  saved: number;
  target: number;
};

/** A goal template offered under "Suggested for you" (design 26). */
export type SavingsSuggestion = {
  id: string;
  name: string;
  icon: SavingsGoalIcon;
};
