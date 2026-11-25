import {
  Car,
  Gift,
  GraduationCap,
  House,
  Laptop,
  Plane,
  Shield,
  type LucideIcon,
} from '@/constants/icons';
import type { SavingsGoalIcon } from '@/types/savings';

/** Lucide icon for each savings goal icon key (designs 26–29). */
export const goalIcons: Record<SavingsGoalIcon, LucideIcon> = {
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
  house: House,
  'graduation-cap': GraduationCap,
  gift: Gift,
  car: Car,
};

/** Accessible names for the icon picker on New savings goal (27). */
export const goalIconLabels: Record<SavingsGoalIcon, string> = {
  house: 'Home',
  shield: 'Emergency',
  plane: 'Travel',
  laptop: 'Gadgets',
  'graduation-cap': 'Education',
  car: 'Car',
  gift: 'Gifts',
};
