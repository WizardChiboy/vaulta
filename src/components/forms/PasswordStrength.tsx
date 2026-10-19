import { View } from 'react-native';

import { Text, type TextTone } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { getPasswordStrength, type PasswordScore } from '@/utils/password';

// Designs 03 (Strong, green) and 06 (Good, orange): 4 segments + label.
const levels: Record<PasswordScore, { bar: string; tone: TextTone }> = {
  0: { bar: 'bg-danger', tone: 'danger' },
  1: { bar: 'bg-danger', tone: 'danger' },
  2: { bar: 'bg-warning', tone: 'warning' },
  3: { bar: 'bg-warning', tone: 'warning' },
  4: { bar: 'bg-primary', tone: 'accent' },
};

const SEGMENTS = [1, 2, 3, 4] as const;

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);
  if (!password) return null;
  const level = levels[score];

  return (
    <View
      className="flex-row items-center gap-2.5 pt-1"
      accessibilityLabel={`Password strength: ${label}`}
    >
      <View className="flex-1 flex-row gap-1">
        {SEGMENTS.map((segment) => (
          <View
            key={segment}
            className={cn('h-1 flex-1 rounded-sm', segment <= score ? level.bar : 'bg-border')}
          />
        ))}
      </View>
      <Text variant="small" weight="semibold" tone={level.tone}>
        {label}
      </Text>
    </View>
  );
}
