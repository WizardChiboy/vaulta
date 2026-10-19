import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Check } from '@/constants/icons';
import { palette } from '@/constants/theme';
import { cn } from '@/lib/cn';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Text or rich content (e.g. with inline links). */
  label: ReactNode;
  error?: string | undefined;
  className?: string | undefined;
};

/** 20px box, green when checked (designs 02, 03). */
export function Checkbox({ checked, onChange, label, error, className }: CheckboxProps) {
  return (
    <View className={cn('gap-1.5', className)}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => onChange(!checked)}
        hitSlop={6}
        className="flex-row items-start gap-md"
      >
        <View
          className={cn(
            'mt-px h-5 w-5 items-center justify-center rounded-[5px] border',
            checked ? 'border-primary bg-primary' : 'border-border-strong bg-surface',
            !!error && !checked && 'border-danger'
          )}
        >
          {checked && <Check size={14} color={palette.white} strokeWidth={3} />}
        </View>
        {typeof label === 'string' ? (
          <Text variant="bodySm" tone="label" className="shrink">
            {label}
          </Text>
        ) : (
          <View className="shrink">{label}</View>
        )}
      </Pressable>
      {error && (
        <Text variant="caption" tone="danger" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}
