import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { OtpInput } from '@/components/forms/OtpInput';
import { AuthScreen } from '@/components/layout/AuthScreen';
import { Button, Text, TextLink } from '@/components/ui';
import { Smartphone } from '@/constants/icons';
import { simulateRequest } from '@/lib/mock';
import { showMessage } from '@/lib/notify';
import { useSession } from '@/store/session';
import { maskPhone } from '@/utils/format';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

function formatCountdown(seconds: number) {
  return `00:${String(seconds).padStart(2, '0')}`;
}

// Design 04 — Verify phone (step 2 of 2). Any 6-digit code is accepted in this demo.
export default function VerifyPhoneScreen() {
  const { pendingSignUp, completeSignUp } = useSession();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const phone = pendingSignUp
    ? maskPhone(pendingSignUp.countryCode, pendingSignUp.phone)
    : '+234 803 ••• 4417';

  const verify = async () => {
    setVerifying(true);
    await completeSignUp();
    // Finish onboarding with a clean stack: no way back into the sign-up form.
    router.dismissAll();
    router.replace('/all-set');
  };

  const resend = async () => {
    setSecondsLeft(RESEND_SECONDS);
    setCode('');
    await simulateRequest(null, 300);
    showMessage('Code sent', `We sent a new code to ${phone}.`);
  };

  return (
    <AuthScreen
      icon={Smartphone}
      title="Verify your phone"
      subtitle={
        <Text variant="body" tone="muted">
          Enter the 6-digit code we sent to{' '}
          <Text variant="body" weight="semibold">
            {phone}
          </Text>
          .
        </Text>
      }
      headerRight={
        <Text variant="caption" weight="semibold" tone="muted">
          Step 2 of 2
        </Text>
      }
    >
      <View className="pt-xl">
        <OtpInput value={code} onChange={setCode} length={CODE_LENGTH} autoFocus />
      </View>

      <View className="flex-row items-center justify-between pt-lg">
        {secondsLeft > 0 ? (
          <Text variant="bodySm" tone="muted">
            Didn’t get it? Resend in{' '}
            <Text variant="bodySm" weight="semibold" style={{ fontVariant: ['tabular-nums'] }}>
              {formatCountdown(secondsLeft)}
            </Text>
          </Text>
        ) : (
          <TextLink onPress={resend} className="py-md">
            Resend code
          </TextLink>
        )}
        <TextLink onPress={() => router.back()} className="py-md">
          Change number
        </TextLink>
      </View>

      <Button
        label="Verify"
        fullWidth
        disabled={code.length < CODE_LENGTH}
        loading={verifying}
        onPress={verify}
        className="mt-md"
      />
    </AuthScreen>
  );
}
