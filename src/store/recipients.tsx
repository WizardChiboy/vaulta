import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { savedRecipients } from '@/mock/recipients';
import type { Recipient } from '@/types/recipient';

/**
 * Saved recipients, shared by Transfer (16), Select recipient (17) and Add recipient (18),
 * plus the bank picked on the bank sheet for the Add recipient form.
 * Mock: starts from fictional data and lives in memory.
 */
type RecipientsContextValue = {
  /** Starred first, then most recently added. */
  recipients: Recipient[];
  getRecipient: (id: string) => Recipient | undefined;
  /** Saves a beneficiary; returns the existing one if that account is already saved. */
  saveRecipient: (recipient: Omit<Recipient, 'id' | 'tone'>) => Recipient;
  /** Bank chosen on the bank sheet, read by Add recipient (18). */
  selectedBankId: string | null;
  setSelectedBankId: (id: string | null) => void;
};

const RecipientsContext = createContext<RecipientsContextValue | null>(null);

function byFavourite(a: Recipient, b: Recipient) {
  return Number(b.favourite ?? false) - Number(a.favourite ?? false);
}

export function RecipientsProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState(savedRecipients);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const recipients = useMemo(() => [...list].sort(byFavourite), [list]);

  const getRecipient = useCallback(
    (id: string) => list.find((recipient) => recipient.id === id),
    [list]
  );

  const saveRecipient = useCallback(
    (input: Omit<Recipient, 'id' | 'tone'>) => {
      const existing = list.find(
        (item) => item.bank === input.bank && item.maskedAccount === input.maskedAccount
      );
      if (existing) return existing;

      const recipient: Recipient = {
        ...input,
        id: `rcp_local_${Date.now()}`,
        // Continue the designs' alternating avatar colours.
        tone: list.length % 2 === 0 ? 'green' : 'neutral',
      };
      setList((previous) => [recipient, ...previous]);
      return recipient;
    },
    [list]
  );

  const value = useMemo(
    () => ({ recipients, getRecipient, saveRecipient, selectedBankId, setSelectedBankId }),
    [recipients, getRecipient, saveRecipient, selectedBankId]
  );

  return <RecipientsContext.Provider value={value}>{children}</RecipientsContext.Provider>;
}

export function useRecipients() {
  const value = useContext(RecipientsContext);
  if (!value) throw new Error('useRecipients must be used inside <RecipientsProvider>');
  return value;
}
