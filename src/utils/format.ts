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

// Built by hand rather than with Intl.DateTimeFormat so the output is the same on every
// engine (e.g. "Sun, 18 Oct" — en-GB on some engines drops the comma).
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole calendar days from `date` to `now` (0 = today, 1 = yesterday). */
function daysBefore(date: Date, now: Date) {
  return Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
}

/** "10:24" */
export function formatTime(iso: string) {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** "15 Oct" */
export function formatDayMonth(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()] ?? ''}`;
}

/** "Sun, 18 Oct" */
export function formatShortDate(iso: string) {
  const weekday = (WEEKDAYS[new Date(iso).getDay()] ?? '').slice(0, 3);
  return `${weekday}, ${formatDayMonth(iso)}`;
}

/** "12 Mar 2024" */
export function formatDate(iso: string) {
  return `${formatDayMonth(iso)} ${new Date(iso).getFullYear()}`;
}

/** "Today" · "Yesterday" · "Thursday" (this week) · "Sun, 4 Oct" (older). */
export function formatDayLabel(iso: string, now = new Date()) {
  const date = new Date(iso);
  const days = daysBefore(date, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days > 1 && days < 7) return WEEKDAYS[date.getDay()] ?? formatShortDate(iso);
  return formatShortDate(iso);
}

/** Short time for list rows: "10:24" today, "Yesterday", then "15 Oct". */
export function formatRelativeTime(iso: string, now = new Date()) {
  const days = daysBefore(new Date(iso), now);
  if (days === 0) return formatTime(iso);
  if (days === 1) return 'Yesterday';
  return formatDayMonth(iso);
}

/** "Adaeze Okafor" → "Adaeze" */
export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? '';
}
