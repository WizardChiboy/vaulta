import { z } from 'zod';

// Validation for Edit profile (design 35).

export const MAX_DISPLAY_NAME_LENGTH = 30;

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .refine((name) => name.split(/\s+/).length >= 2, 'Enter your first and last name'),
  displayName: z
    .string()
    .trim()
    .min(1, 'Enter a display name')
    .max(MAX_DISPLAY_NAME_LENGTH, `Use ${MAX_DISPLAY_NAME_LENGTH} characters or fewer`),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address')
    .pipe(z.email('Enter a valid email address')),
});
export type ProfileForm = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;
