export type Recipient = {
  id: string;
  fullName: string;
  /** Shown under the avatar on Transfer (16), e.g. "Tunde". */
  shortName: string;
  /** Bank as shown in lists, e.g. "GTBank"; "Vaulta" for Vaulta accounts. */
  bank: string;
  /** e.g. "0123 •• 4489", or the @tag for Vaulta accounts ("@kelechi"). */
  maskedAccount: string;
  /** Avatar colour in the designs alternates green and grey. */
  tone: 'green' | 'neutral';
  /** Starred recipients are listed first on Select recipient (17). */
  favourite?: boolean | undefined;
  /** Vaulta to Vaulta transfers are instant and free (the "Free" tag on 17). */
  vaulta?: boolean | undefined;
};

export type RecentTransfer = {
  id: string;
  recipientId: string;
  /** Naira. */
  amount: number;
  /** ISO 8601 date-time. */
  sentAt: string;
};

export type Bank = {
  id: string;
  /** Full name, shown on the bank picker (18), e.g. "Guaranty Trust Bank". */
  name: string;
  /** Short name, shown in recipient lists, e.g. "GTBank". */
  shortName: string;
};

/** Result of an account-name lookup (18). */
export type AccountLookup = { found: true; accountName: string } | { found: false };
