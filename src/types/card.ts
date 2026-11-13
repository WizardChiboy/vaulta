export type CardStatus = 'active' | 'frozen' | 'blocked';
export type CardKind = 'virtual' | 'physical';

/** Toggles on Card controls (25). Freezing is the card's `status`, not a control. */
export type CardControls = {
  onlinePayments: boolean;
  internationalPayments: boolean;
  notifications: boolean;
};

export type Card = {
  id: string;
  kind: CardKind;
  /** Display-only last 4 digits: "7302". */
  last4: string;
  /** Mock full number — fictional, displayed on reveal only. */
  fullNumber: string;
  expiry: string;
  cvv: string;
  status: CardStatus;
  holderName: string;
  billingAddress: string;
  monthlySpend: number;
  monthlyLimit: number;
  /** Largest single payment allowed. */
  transactionLimit: number;
  controls: CardControls;
  /** Four relative weekly bar heights (0–1) for the mini chart. */
  weeklyBars: [number, number, number, number];
  /** Short purpose label: "Online payments". */
  purpose: string;
};
