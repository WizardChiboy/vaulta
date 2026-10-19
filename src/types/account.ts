export type AccountSummary = {
  id: string;
  name: string;
  /** Last four digits only — never store full account or card numbers. */
  maskedNumber: string;
  currency: string;
  balance: number;
  monthlyChangePercent: number;
};
