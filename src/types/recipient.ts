export type Recipient = {
  id: string;
  fullName: string;
  /** Shown under the avatar on Transfer (16), e.g. "Tunde". */
  shortName: string;
  bank: string;
  /** e.g. "0123 •• 4489" */
  maskedAccount: string;
  /** Avatar colour in the designs alternates green and grey. */
  tone: 'green' | 'neutral';
};

export type RecentTransfer = {
  id: string;
  recipientId: string;
  /** Naira. */
  amount: number;
  /** ISO 8601 date-time. */
  sentAt: string;
};
