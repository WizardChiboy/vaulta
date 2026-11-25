import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { simulateRequest } from '@/lib/mock';
import { demoUser } from '@/mock/user';
import type { User } from '@/types/user';
import { firstName } from '@/utils/format';

/**
 * Mock authentication. Nothing is sent anywhere and no credentials are stored; the
 * session lives in memory, so a full reload signs you out.
 */
export type SignUpDetails = {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
};

type SessionContextValue = {
  user: User | null;
  /** Sign-up details held between "Create account" and "Verify phone". */
  pendingSignUp: SignUpDetails | null;
  signIn: () => Promise<void>;
  startSignUp: (details: SignUpDetails) => Promise<void>;
  /** Called after the phone is verified; creates the (mock) account. */
  completeSignUp: () => Promise<void>;
  /** Edit profile (35): saves the editable fields. */
  updateProfile: (changes: ProfileChanges) => Promise<void>;
  signOut: () => void;
};

export type ProfileChanges = Pick<User, 'fullName' | 'displayName' | 'email'>;

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingSignUp, setPendingSignUp] = useState<SignUpDetails | null>(null);

  const signIn = useCallback(async () => {
    setUser(await simulateRequest(demoUser));
  }, []);

  const startSignUp = useCallback(async (details: SignUpDetails) => {
    setPendingSignUp(await simulateRequest(details));
  }, []);

  const completeSignUp = useCallback(async () => {
    await simulateRequest(null);
    setUser((current) => {
      if (!pendingSignUp) return current ?? demoUser;
      return {
        ...demoUser,
        fullName: pendingSignUp.fullName,
        displayName: firstName(pendingSignUp.fullName),
        email: pendingSignUp.email,
        phone: `${pendingSignUp.countryCode} ${pendingSignUp.phone}`,
      };
    });
    setPendingSignUp(null);
  }, [pendingSignUp]);

  const updateProfile = useCallback(async (changes: ProfileChanges) => {
    await simulateRequest(null);
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, pendingSignUp, signIn, startSignUp, completeSignUp, updateProfile, signOut }),
    [user, pendingSignUp, signIn, startSignUp, completeSignUp, updateProfile, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}
