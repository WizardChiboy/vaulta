import { View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '@/components/forms/TextField';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, Card, Text, TextLink } from '@/components/ui';
import { ICON_STROKE, LockKeyholeOpen, Mail, Shield } from '@/constants/icons';
import { simulateRequest } from '@/lib/mock';
import { forgotPasswordSchema, type ForgotPasswordForm } from '@/lib/schemas/auth';

const STEPS = [
  'We send a 6-digit code to your email. It expires in 10 minutes.',
  'Enter the code to confirm it’s really you.',
  'Create a new password and sign in again.',
];

// Design 05 — Forgot password.
export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = handleSubmit(async () => {
    await simulateRequest(null);
    router.push('/reset-password');
  });

  return (
    <AuthScreen
      icon={LockKeyholeOpen}
      title="Forgot password?"
      subtitle="Enter the email or phone number linked to your account and we’ll send you a reset code."
      footer={
        <>
          <Button
            label="Send reset code"
            fullWidth
            loading={isSubmitting}
            onPress={() => onSubmit()}
          />
          <Text variant="bodySm" tone="muted" className="text-center">
            Remembered it? <TextLink onPress={() => router.back()}>Back to sign in</TextLink>
          </Text>
        </>
      }
    >
      <Controller
        control={control}
        name="identifier"
        render={({ field }) => (
          <TextField
            label="Email or phone number"
            leadingIcon={Mail}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.identifier?.message}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
            returnKeyType="send"
            onSubmitEditing={() => onSubmit()}
            containerClassName="pt-xl"
          />
        )}
      />

      <Card padded={false} className="mt-gutter gap-3.5 p-[18px]">
        <Text variant="bodySm" weight="semibold">
          What happens next
        </Text>
        {STEPS.map((step, index) => (
          <View key={step} className="flex-row items-start gap-md">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-accent-soft">
              <Text variant="caption" weight="bold" tone="accent">
                {index + 1}
              </Text>
            </View>
            <Text variant="bodySm" tone="label" className="shrink pt-1">
              {step}
            </Text>
          </View>
        ))}
      </Card>

      <View className="flex-row items-start gap-2.5 pt-lg">
        <Shield size={18} color={colors.accent} strokeWidth={ICON_STROKE} />
        <Text variant="caption" tone="muted" className="shrink">
          Vaulta will never ask for your password or PIN by phone, SMS or email.
        </Text>
      </View>
    </AuthScreen>
  );
}
