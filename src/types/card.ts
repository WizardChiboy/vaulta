export type CardStatus = 'active' | 'frozen' | 'blocked';
export type CardKind = 'virtual' | 'physical';

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
  /** Four relative weekly bar heights (0–1) for the mini chart. */
  weeklyBars: [number, number, number, number];
  /** Short purpose label: "Online payments". */
  purpose: string;
};
