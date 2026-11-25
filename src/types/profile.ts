/** Extra profile details shown on Profile (34) and Personal information (36). */
export type ProfileDetails = {
  /** "@adaeze" without the @. */
  handle: string;
  tier: string;
  dailyLimit: number;
  memberSince: number;
  legalName: string;
  /** ISO 8601 date. */
  dateOfBirth: string;
  /** 11 digits. Fictional. */
  bvn: string;
  address: string;
  nationality: string;
  customerId: string;
  /** ISO 8601 date the identity check passed. */
  verifiedAt: string;
};

export type DeviceKind = 'phone' | 'laptop';

/** A device signed in to the account, on Security (37). */
export type TrustedDevice = {
  id: string;
  name: string;
  kind: DeviceKind;
  /** "Vaulta app" or the browser, e.g. "Chrome". */
  client: string;
  location: string;
  /** ISO 8601 date-time of the last activity. */
  lastActiveAt: string;
  current: boolean;
};
