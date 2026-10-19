export function formatCurrency(amount: number, currency = 'NGN', locale = 'en-NG') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/**
 * Splits a formatted amount so the fraction can be styled separately,
 * as in the designs: "₦2,450,800" + ".00" (muted).
 */
export function formatCurrencyParts(amount: number, currency = 'NGN', locale = 'en-NG') {
  const formatted = formatCurrency(amount, currency, locale);
  const dot = formatted.lastIndexOf('.');
  return dot === -1
    ? { whole: formatted, fraction: '' }
    : { whole: formatted.slice(0, dot), fraction: formatted.slice(dot) };
}

export function formatPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

/** "+234 803 512 4417" → "+234 803 ••• 4417" */
export function maskPhone(countryCode: string, phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return `${countryCode} ${phone}`.trim();
  return `${countryCode} ${digits.slice(0, 3)} ••• ${digits.slice(-4)}`;
}

/** "Adaeze Okafor" → "Adaeze" */
export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? '';
}
