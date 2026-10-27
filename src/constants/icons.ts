/**
 * App icon registry.
 *
 * Import icons from here, not from 'lucide-react-native' directly: Metro does
 * not tree-shake the package's barrel export, which would bundle ~1,900 icons.
 * Per-icon paths keep the bundle limited to icons actually used.
 * Browse names at https://lucide.dev/icons (kebab-case file = icon name).
 * The design-icon → Lucide mapping for all screens is in docs/IMPLEMENTATION_CHECKLIST.md.
 */
export type { LucideIcon, LucideProps } from 'lucide-react-native';

/** Stroke width used by the icons in the screen designs. */
export const ICON_STROKE = 1.8;

export { default as ArrowDownLeft } from 'lucide-react-native/icons/arrow-down-left';
export { default as ArrowRightLeft } from 'lucide-react-native/icons/arrow-right-left';
export { default as ArrowUpRight } from 'lucide-react-native/icons/arrow-up-right';
export { default as Bell } from 'lucide-react-native/icons/bell';
export { default as BriefcaseMedical } from 'lucide-react-native/icons/briefcase-medical';
export { default as Car } from 'lucide-react-native/icons/car';
export { default as Check } from 'lucide-react-native/icons/check';
export { default as ChevronDown } from 'lucide-react-native/icons/chevron-down';
export { default as ChevronLeft } from 'lucide-react-native/icons/chevron-left';
export { default as CircleAlert } from 'lucide-react-native/icons/circle-alert';
export { default as Copy } from 'lucide-react-native/icons/copy';
export { default as CreditCard } from 'lucide-react-native/icons/credit-card';
export { default as Eye } from 'lucide-react-native/icons/eye';
export { default as EyeOff } from 'lucide-react-native/icons/eye-off';
export { default as House } from 'lucide-react-native/icons/house';
export { default as LockKeyholeOpen } from 'lucide-react-native/icons/lock-keyhole-open';
export { default as Mail } from 'lucide-react-native/icons/mail';
export { default as Plus } from 'lucide-react-native/icons/plus';
export { default as ScanFace } from 'lucide-react-native/icons/scan-face';
export { default as Shield } from 'lucide-react-native/icons/shield';
export { default as ShoppingCart } from 'lucide-react-native/icons/shopping-cart';
export { default as Smartphone } from 'lucide-react-native/icons/smartphone';
export { default as User } from 'lucide-react-native/icons/user';
