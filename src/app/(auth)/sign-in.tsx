import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Checkbox } from '@/components/forms/Checkbox';
import { PasswordField } from '@/components/forms/PasswordField';
import { TextField } from '@/components/forms/TextField';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { Button, SegmentedControl, Text, TextLink } from '@/components/ui';
import { ScanFace } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import { signInSchema, type SignInForm } from '@/lib/schemas/auth';
import { useSession } from '@/store/session';

const METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone number' },
] as const;

const MAX_ATTEMPTS = 3;

// Demo rule so the design's error state can be seen: passwords under 8 characters are "wrong".
const isMockPasswordCorrect = (password: string) => password.length >= 8;

function finishSignIn(name: string) {
  showMessage(`Signed in as ${name}`, 'This is a demo — the dashboard is the next module.');
}

// Design 02 — Sign in.
export default function SignInScreen() {
  const { signIn } = useSession();
  const [rememberMe, setRememberMe] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [faceIdLoading, setFaceIdLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { method: 'email', email: '', phone: '', password: '' },
  });
  const method = useWatch({ control, name: 'method' });
  const locked = attemptsLeft === 0;

  const onSubmit = handleSubmit(async (values) => {
    if (!isMockPasswordCorrect(values.password)) {
      const left = attemptsLeft - 1;
      setAttemptsLeft(left);
      setError('password', {
        message:
          left > 0
            ? `Incorrect password. You have ${left} attempt${left === 1 ? '' : 's'} left.`
            : 'Too many attempts. Reset your password to continue.',
      });
      return;
    }
    await signIn();
    finishSignIn('Adaeze');
  });

  const signInWithFaceId = async () => {
    setFaceIdLoading(true);
    await signIn();
    setFaceIdLoading(false);
    finishSignIn('Adaeze');
  };

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue to your Vaulta account."
      footer={
        <Text variant="bodySm" tone="muted" className="text-center">
          New to Vaulta?{' '}
          <TextLink onPress={() => router.replace('/sign-up')}>Create an account</TextLink>
        </Text>
      }
    >
      <SegmentedControl
        options={METHODS}
        value={method}
        onChange={(next) => {
          setValue('method', next);
          clearErrors();
        }}
        accessibilityLabel="Sign in with"
        className="mt-xl"
      />

      <View className="gap-lg pt-gutter">
        {method === 'email' ? (
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
        ) : (
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <TextField
                label="Phone number"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                placeholder="803 512 4417"
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordField
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
              autoComplete="current-password"
              textContentType="password"
              placeholder="Enter your password"
              returnKeyType="go"
              onSubmitEditing={() => onSubmit()}
            />
          )}
        />

        <View className="flex-row items-center justify-between">
          <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
          <TextLink onPress={() => router.push('/forgot-password')} className="py-md">
            Forgot password?
          </TextLink>
        </View>
      </View>

      <View className="gap-lg pt-sm">
        <Button
          label="Sign in"
          fullWidth
          loading={isSubmitting}
          disabled={locked}
          onPress={() => onSubmit()}
        />
        <View className="flex-row items-center gap-md" accessibilityElementsHidden>
          <View className="h-px flex-1 bg-border" />
          <Text variant="caption" tone="muted">
            or
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>
        <Button
          label="Sign in with Face ID"
          variant="secondary"
          leadingIcon={ScanFace}
          fullWidth
          loading={faceIdLoading}
          onPress={signInWithFaceId}
        />
      </View>
    </AuthScreen>
  );
}
