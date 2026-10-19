import { z } from 'zod';

import { isPasswordValid } from '@/utils/password';

// Validation for the auth forms (designs 02, 03, 05, 06). Messages are shown under each field.

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .pipe(z.email('Enter a valid email address'));

/** Nigerian mobile number without the country code: 10 digits, or 11 starting with 0. */
const phone = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((digits) => /^(0\d{10}|[1-9]\d{9})$/.test(digits), 'Enter a valid phone number');

// One flat shape (both fields always present as strings) so the form's types match runtime;
// only the field for the selected method is validated.
export const signInSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    email: z.string(),
    phone: z.string(),
    password: z.string().min(1, 'Enter your password'),
  })
  .superRefine((values, ctx) => {
    const field = values.method;
    const result = (field === 'email' ? email : phone).safeParse(values[field]);
    if (!result.success) {
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: result.error.issues[0]?.message ?? 'Check this field',
      });
    }
  });
export type SignInForm = z.input<typeof signInSchema>;

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .refine((name) => name.split(/\s+/).length >= 2, 'Enter your first and last name'),
  email,
  phone,
  password: z
    .string()
    .refine(isPasswordValid, 'Use 8+ characters with an uppercase letter and a number'),
  acceptTerms: z.boolean().refine(Boolean, 'Please accept the terms to continue'),
});
export type SignUpForm = z.input<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email or phone number')
    .refine(
      (value) => z.email().safeParse(value).success || /^\+?[\d\s]{10,15}$/.test(value),
      'Enter a valid email or phone number'
    ),
});
export type ForgotPasswordForm = z.input<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().refine(isPasswordValid, 'Your password doesn’t meet the requirements yet'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords don’t match',
  });
export type ResetPasswordForm = z.input<typeof resetPasswordSchema>;
