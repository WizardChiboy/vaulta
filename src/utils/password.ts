export type PasswordRequirement = {
  key: 'length' | 'uppercase' | 'number' | 'special';
  label: string;
  met: boolean;
  /** Recommended only — not needed for a valid password. */
  optional?: boolean;
};

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { key: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { key: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { key: 'number', label: 'One number', met: /\d/.test(password) },
    {
      key: 'special',
      label: 'One special character (recommended)',
      met: /[^A-Za-z0-9]/.test(password),
      optional: true,
    },
  ];
}

/** True when every required (non-optional) rule is met. */
export function isPasswordValid(password: string) {
  return getPasswordRequirements(password).every((r) => r.met || r.optional);
}

/** One point per rule met. */
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

const STRENGTH_LABELS = {
  0: 'Too short',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
} as const satisfies Record<PasswordScore, string>;

export type PasswordStrength = {
  score: PasswordScore;
  label: (typeof STRENGTH_LABELS)[PasswordScore];
};

function toScore(count: number): PasswordScore {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export function getPasswordStrength(password: string): PasswordStrength {
  const score = password
    ? toScore(getPasswordRequirements(password).filter((r) => r.met).length)
    : 0;
  return { score, label: STRENGTH_LABELS[score] };
}
