import { View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PasswordField } from '@/components/forms/PasswordField';
import { PasswordStrength } from '@/components/forms/PasswordStrength';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, Card, Text } from '@/components/ui';
import { Check } from '@/constants/icons';
import { simulateRequest } from '@/lib/mock';
import { showMessage } from '@/lib/notify';
import { resetPasswordSchema, type ResetPasswordForm } from '@/lib/schemas/auth';
import { cn } from '@/lib/cn';
import { getPasswordRequirements } from '@/utils/password';

// Design 06 — Create a new password.
export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });
  const matches = confirmPassword.length > 0 && confirmPassword === password;

  const onSubmit = handleSubmit(async () => {
    await simulateRequest(null);
    showMessage('Password updated', 'Sign in with your new password.');
    router.dismissTo('/sign-in');
  });

  return (
    <AuthScreen
      title="Create a new password"
      subtitle="Choose something you haven’t used on Vaulta before."
      footer={
        <Button
          label="Reset password"
          fullWidth
          loading={isSubmitting}
          onPress={() => onSubmit()}
        />
      }
    >
      <View className="gap-lg pt-xl">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View>
              <PasswordField
                label="New password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
                autoComplete="new-password"
                textContentType="newPassword"
                placeholder="New password"
              />
              <PasswordStrength password={password} />
            </View>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordField
              label="Confirm new password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.confirmPassword?.message}
              success={matches ? 'Passwords match' : undefined}
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Repeat new password"
              returnKeyType="done"
              onSubmitEditing={() => onSubmit()}
            />
          )}
        />
      </View>

      <Card padded={false} className="mt-gutter gap-md p-[18px]">
        <Text variant="bodySm" weight="semibold">
          Password must include
        </Text>
        {getPasswordRequirements(password).map((rule) => (
          <View
            key={rule.key}
            className="flex-row items-center gap-2.5"
            accessibilityLabel={`${rule.label}: ${rule.met ? 'met' : 'not met'}`}
          >
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded-full',
                rule.met ? 'bg-primary' : 'border-[1.5px] border-border-strong'
              )}
            >
              {rule.met && <Check size={12} color={colors['primary-foreground']} strokeWidth={3} />}
            </View>
            <Text variant="bodySm" tone={rule.met ? 'label' : 'muted'}>
              {rule.label}
            </Text>
          </View>
        ))}
      </Card>
    </AuthScreen>
  );
}
