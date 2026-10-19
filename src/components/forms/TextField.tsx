import { useState, type ComponentRef, type Ref } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/components/layout/ThemeProvider';
import { Text } from '@/components/ui/Text';
import { Check, CircleAlert, ICON_STROKE, type LucideIcon } from '@/constants/icons';
import { fontFamily, typeScale } from '@/constants/theme';
import { cn } from '@/lib/cn';

export type TextFieldProps = TextInputProps & {
  label?: string | undefined;
  /** Shown below the input with an alert icon; switches the field to its error state. */
  error?: string | undefined;
  /** Positive confirmation below the input (e.g. "Passwords match"); green border. */
  success?: string | undefined;
  hint?: string | undefined;
  leadingIcon?: LucideIcon | undefined;
  trailingIcon?: LucideIcon | undefined;
  /** Makes the trailing icon tappable, e.g. a show/hide password toggle. */
  onTrailingIconPress?: (() => void) | undefined;
  trailingIconLabel?: string | undefined;
  containerClassName?: string | undefined;
  ref?: Ref<ComponentRef<typeof TextInput>> | undefined;
};

export function TextField({
  label,
  error,
  success,
  hint,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onTrailingIconPress,
  trailingIconLabel,
  containerClassName,
  editable = true,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const iconColor = error ? colors.danger : focused ? colors.accent : colors.muted;
  // Designs: focus = green border + 4px soft green ring; error = red border + 4px red ring.
  const ring = error ? colors['danger-ring'] : focused ? colors['focus-ring'] : undefined;

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label && (
        <Text variant="caption" weight="medium" tone="label">
          {label}
        </Text>
      )}

      <View
        className={cn(
          'h-[52px] flex-row items-center gap-md rounded-md border bg-surface px-[14px]',
          error ? 'border-danger' : focused || success ? 'border-primary' : 'border-border-strong',
          !editable && 'bg-surface-muted'
        )}
        style={ring ? { boxShadow: `0px 0px 0px 4px ${ring}` } : undefined}
      >
        {LeadingIcon && <LeadingIcon size={20} color={iconColor} strokeWidth={ICON_STROKE} />}

        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={colors.subtle}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          accessibilityHint={error ?? success ?? hint}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          // fontSize only: a fixed lineHeight misaligns TextInput text on iOS.
          className={cn('h-full flex-1', editable ? 'text-foreground' : 'text-muted')}
          style={{ fontFamily: fontFamily.regular, fontSize: typeScale['body-lg'][0] }}
          {...props}
        />

        {TrailingIcon &&
          (onTrailingIconPress ? (
            <Pressable
              onPress={onTrailingIconPress}
              accessibilityRole="button"
              accessibilityLabel={trailingIconLabel}
              hitSlop={12}
            >
              <TrailingIcon size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
            </Pressable>
          ) : (
            <TrailingIcon size={20} color={colors.muted} strokeWidth={ICON_STROKE} />
          ))}
      </View>

      {error ? (
        <View accessibilityRole="alert" className="flex-row items-center gap-1.5 pt-0.5">
          <CircleAlert size={16} color={colors['danger-text']} strokeWidth={ICON_STROKE} />
          <Text variant="caption" tone="danger" className="flex-1">
            {error}
          </Text>
        </View>
      ) : success ? (
        <View className="flex-row items-center gap-1.5 pt-0.5">
          <Check size={16} color={colors.accent} strokeWidth={ICON_STROKE} />
          <Text variant="caption" weight="medium" tone="accent">
            {success}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
