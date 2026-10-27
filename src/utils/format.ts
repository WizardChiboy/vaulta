export function formatCurrency(amount: number, currency = 'NGN', locale = 'en-NG') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/** "₦486,250" — whole units, for summaries. */
export function formatWholeCurrency(amount: number, currency = 'NGN', locale = 'en-NG') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "₦600k" — thousands, for tight labels. */
export function formatThousands(amount: number, currency = 'NGN', locale = 'en-NG') {
  return `${formatWholeCurrency(amount / 1000, currency, locale)}k`;
}

/** "+₦45,000.00" / "−₦18,450.00" (true minus sign, as in the designs). */
export function formatSignedCurrency(amount: number, currency = 'NGN', locale = 'en-NG') {
  return `${amount < 0 ? '−' : '+'}${formatCurrency(Math.abs(amount), currency, locale)}`;
}

/** "$1,240.50" — US dollars in their own locale, so it isn't shown as "US$". */
export function formatUsd(amount: number) {
  return formatCurrency(amount, 'USD', 'en-US');
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
