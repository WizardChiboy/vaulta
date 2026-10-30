import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Check, Copy, ICON_STROKE } from '@/constants/icons';
import { cn } from '@/lib/cn';

export type CopyButtonProps = {
  /** What is copied, e.g. "account number" → "Copy account number" / "Account number copied". */
  subject: string;
  className?: string | undefined;
};

/**
 * 28px green copy icon (10, 12). Shows a tick for two seconds after a press.
 * Simulated: demo numbers are fictional, so nothing is put on the clipboard.
 */
export function CopyButton({ subject, className }: CopyButtonProps) {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const Icon = copied ? Check : Copy;
  const label = copied
    ? `${subject.charAt(0).toUpperCase()}${subject.slice(1)} copied`
    : `Copy ${subject}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={copy}
      hitSlop={8}
      className={cn('h-7 w-7 items-center justify-center active:opacity-70', className)}
    >
      <Icon size={16} color={colors.accent} strokeWidth={ICON_STROKE} />
    </Pressable>
  );
}
