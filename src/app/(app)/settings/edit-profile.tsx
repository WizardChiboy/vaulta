import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TextField } from '@/components/forms/TextField';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button, getInitials, Text, TextLink } from '@/components/ui';
import { Camera, Check, ICON_STROKE, Lock } from '@/constants/icons';
import { showMessage } from '@/lib/notify';
import {
  MAX_DISPLAY_NAME_LENGTH,
  profileSchema,
  type ProfileForm,
  type ProfileValues,
} from '@/lib/schemas/profile';
import { useSession } from '@/store/session';
import { maskPhone } from '@/utils/format';

function changePhoto() {
  showMessage('Change photo', 'This is a demo — profile photos aren’t available yet.');
}

/** "+234 803 000 0000" → "+234 803 ••• 0000" */
function maskedPhone(phone: string) {
  const [countryCode = '', ...rest] = phone.split(' ');
  return maskPhone(countryCode, rest.join(' '));
}

// Design 35 — Edit profile.
export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, updateProfile } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileForm, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      displayName: user?.displayName ?? '',
      email: user?.email ?? '',
    },
  });
  const fullName = useWatch({ control, name: 'fullName' });
  const email = useWatch({ control, name: 'email' });

  if (!user) return null;

  const emailVerified = email.trim() === user.email;

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile(values);
    router.back();
  });

  return (
    <Screen scroll contentClassName="pb-3xl">
      <ScreenHeader title="Edit profile" />

      <View className="mt-lg items-center">
        <View>
          <View
            className="h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-surface bg-accent-soft"
            style={{ boxShadow: `0px 0px 0px 1px ${colors.border}` }}
          >
            <Text tone="accent" weight="bold" style={{ fontSize: 32, lineHeight: 40 }}>
              {getInitials(fullName.trim() || user.fullName)}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={changePhoto}
            className="absolute -bottom-1 -right-1 h-10 w-10 items-center justify-center rounded-full border-[3px] border-background bg-brand active:opacity-80"
          >
            <Camera size={18} color={colors['brand-foreground']} strokeWidth={ICON_STROKE} />
          </Pressable>
        </View>
        <TextLink accessibilityRole="button" onPress={changePhoto} className="mt-md p-sm">
          Change photo
        </TextLink>
      </View>

      <View className="gap-lg pt-2.5">
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
            />
          )}
        />
        <Controller
          control={control}
          name="displayName"
          render={({ field }) => (
            <TextField
              label="Display name"
              labelAccessory={
                <Text variant="caption" tone="muted">
                  Shown to people you pay
                </Text>
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.displayName?.message}
              autoCapitalize="words"
              autoComplete="name-given"
              textContentType="nickname"
              maxLength={MAX_DISPLAY_NAME_LENGTH}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              label="Email"
              labelAccessory={
                emailVerified ? (
                  <View className="flex-row items-center gap-1">
                    <Check size={13} color={colors.accent} strokeWidth={2.6} />
                    <Text variant="caption" weight="semibold" tone="accent">
                      Verified
                    </Text>
                  </View>
                ) : (
                  <Text variant="caption" tone="muted">
                    We’ll send a link to verify it
                  </Text>
                )
              }
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
          )}
        />
        <View className="gap-1.5">
          <TextField label="Phone number" value={maskedPhone(user.phone)} editable={false} />
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Lock size={14} color={colors.muted} strokeWidth={ICON_STROKE} />
            <Text variant="small" tone="muted">
              Changing your phone needs re-verification.
            </Text>
            <TextLink
              variant="small"
              accessibilityRole="button"
              onPress={() =>
                showMessage(
                  'Change phone number',
                  'This is a demo — changing your phone number isn’t available yet.'
                )
              }
            >
              Start
            </TextLink>
          </View>
        </View>
      </View>

      <View className="mt-auto pt-xl">
        <Button
          label="Save changes"
          disabled={!isDirty}
          loading={isSubmitting}
          onPress={() => void onSubmit()}
        />
      </View>
    </Screen>
  );
}
