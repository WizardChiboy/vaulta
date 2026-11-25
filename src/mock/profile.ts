import type { ProfileDetails, TrustedDevice } from '@/types/profile';

// Fictional details from the Profile designs (34, 36, 37). Never real identity data.

export const profileDetails: ProfileDetails = {
  handle: 'adaeze',
  tier: 'Tier 3',
  dailyLimit: 5_000_000,
  memberSince: 2024,
  legalName: 'Adaeze Chioma Okafor',
  dateOfBirth: '1994-03-14',
  bvn: '22200000081',
  address: 'Lekki, Lagos',
  nationality: 'Nigerian',
  customerId: 'VLT-00482190',
  verifiedAt: '2024-03-08',
};

/** The password was last changed about three months ago (37). */
export const passwordChangedAt = '2026-07-20T09:00:00';

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/** This device first, then the new sign-in that raises the alert on Security (37). */
export function initialDevices(): TrustedDevice[] {
  return [
    {
      id: 'dev_iphone',
      name: 'iPhone 15',
      kind: 'phone',
      client: 'Vaulta app',
      location: 'Lagos',
      lastActiveAt: minutesAgo(0),
      current: true,
    },
    {
      id: 'dev_macbook',
      name: 'MacBook Air',
      kind: 'laptop',
      client: 'Chrome',
      location: 'Lagos',
      lastActiveAt: minutesAgo(60),
      current: false,
    },
  ];
}
