import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Checkbox } from '@/components/forms/Checkbox';
import { PasswordField } from '@/components/forms/PasswordField';
import { PasswordStrength } from '@/components/forms/PasswordStrength';
import { TextField } from '@/components/forms/TextField';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button, ProgressBar, Text, TextLink } from '@/components/ui';
import { ChevronDown, ICON_STROKE } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { signUpSchema, type SignUpForm } from '@/lib/schemas/auth';
import { useSession } from '@/store/session';

const COUNTRY_CODE = '+234';

// Design 03 — Create account (step 1 of 2).
export default function SignUpScreen() {
  const { colors } = useTheme();
  const { startSignUp } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', acceptTerms: false },
  });
  const password = useWatch({ control, name: 'password' });

  const onSubmit = handleSubmit(async (values) => {
    await startSignUp({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      countryCode: COUNTRY_CODE,
      phone: values.phone,
    });
    router.push('/verify-phone');
  });

  return (
    <AuthScreen
      title="Create your account"
      subtitle="It takes about two minutes. Use details that match your ID."
      headerRight={
        <Text variant="caption" weight="semibold" tone="muted">
          Step 1 of 2
        </Text>
      }
      beforeTitle={<ProgressBar value={0.5} size="thin" className="mx-gutter-lg mb-md" />}
      footer={
        <Text variant="bodySm" tone="muted" className="text-center">
          Already have an account?{' '}
          <TextLink onPress={() => router.replace('/sign-in')}>Sign in</TextLink>
        </Text>
      }
    >
      <View className="gap-3.5 pt-gutter">
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextField
              label="Full name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.fullName?.message}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              placeholder="First and last name"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="you@example.com"
            />
          )}
        />

        <View className="gap-1.5">
          <Text variant="caption" weight="medium" tone="label">
            Phone number
          </Text>
          <View className="flex-row items-start gap-sm">
            {/* Only Nigeria (+234) in this demo. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Country code Nigeria ${COUNTRY_CODE}`}
              onPress={() =>
                showMessage('Nigeria (+234)', 'Other countries aren’t available in this demo.')
              }
              className="h-[52px] flex-row items-center gap-1.5 rounded-md border border-border-strong bg-surface px-md"
            >
              <Text variant="bodyLg">{COUNTRY_CODE}</Text>
              <ChevronDown size={16} color={colors.muted} strokeWidth={ICON_STROKE} />
            </Pressable>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.phone?.message}
                  accessibilityLabel="Phone number"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  placeholder="803 512 4417"
                  containerClassName="flex-1"
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View>
              <PasswordField
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
                autoComplete="new-password"
                textContentType="newPassword"
                placeholder="Create a password"
              />
              <PasswordStrength password={password} />
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={field.onChange}
            error={errors.acceptTerms?.message}
            className="pt-[18px]"
            label={
              <Text variant="bodySm" tone="label" style={{ lineHeight: 21 }}>
                I agree to Vaulta’s{' '}
                <TextLink
                  onPress={() => showMessage('Terms of Service', 'Demo app — no terms yet.')}
                >
                  Terms of Service
                </TextLink>{' '}
                and{' '}
                <TextLink
                  onPress={() => showMessage('Privacy Policy', 'Demo app — no data is collected.')}
                >
                  Privacy Policy
                </TextLink>
                .
              </Text>
            }
          />
        )}
      />

      <Button
        label="Continue"
        fullWidth
        loading={isSubmitting}
        onPress={() => onSubmit()}
        className="mt-gutter"
      />
    </AuthScreen>
  );
}
