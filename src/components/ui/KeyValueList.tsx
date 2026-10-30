import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { Card } from './Card';
import { Text } from './Text';

export type KeyValueItem = {
  label: string;
  /** Plain text is right-aligned in 14px/500; pass a node for chips, copy buttons, etc. */
  value: ReactNode;
};

export type KeyValueListProps = {
  items: readonly KeyValueItem[];
  className?: string | undefined;
};

/** Design .kv list: muted label left, value right, light dividers, inside a card (10 12 20 29). */
export function KeyValueList({ items, className }: KeyValueListProps) {
  return (
    <Card padded={false} className={cn(className)}>
      {items.map((item, index) => (
        <View
          key={item.label}
          className={cn(
            'min-h-[47px] flex-row items-center justify-between gap-md px-lg py-[13px]',
            index < items.length - 1 && 'border-b border-surface-muted'
          )}
        >
          <Text variant="bodySm" tone="muted">
            {item.label}
          </Text>
          {typeof item.value === 'string' ? (
            <Text variant="bodySm" weight="medium" className="flex-shrink text-right">
              {item.value}
            </Text>
          ) : (
            <View className="flex-shrink flex-row items-center gap-1.5">{item.value}</View>
          )}
        </View>
      ))}
    </Card>
  );
}
