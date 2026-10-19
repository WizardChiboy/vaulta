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
export { default as Check } from 'lucide-react-native/icons/check';
export { default as ChevronDown } from 'lucide-react-native/icons/chevron-down';
export { default as ChevronLeft } from 'lucide-react-native/icons/chevron-left';
export { default as CircleAlert } from 'lucide-react-native/icons/circle-alert';
export { default as Copy } from 'lucide-react-native/icons/copy';
export { default as Eye } from 'lucide-react-native/icons/eye';
export { default as EyeOff } from 'lucide-react-native/icons/eye-off';
export { default as LockKeyholeOpen } from 'lucide-react-native/icons/lock-keyhole-open';
export { default as Mail } from 'lucide-react-native/icons/mail';
export { default as ScanFace } from 'lucide-react-native/icons/scan-face';
export { default as Shield } from 'lucide-react-native/icons/shield';
export { default as Smartphone } from 'lucide-react-native/icons/smartphone';
