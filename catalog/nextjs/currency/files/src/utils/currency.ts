type CurrencyOptions = {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function formatCurrency(
  amount: number,
  { currency = 'USD', locale = 'es-CO', minimumFractionDigits = 2, maximumFractionDigits = 2 }: CurrencyOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export function formatAmount(
  amount: number,
  { locale = 'es-CO', minimumFractionDigits = 2, maximumFractionDigits = 2 }: Omit<CurrencyOptions, 'currency'> = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

export function parseCurrency(value: string): number {
  // Note: for financial calculations requiring exact precision, use a library like decimal.js
  // This utility is suitable for display/input parsing only
  const cleaned = value.replace(/[^0-9.,]/g, '')
  if (!cleaned) return 0
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  let normalized: string
  if (lastComma > lastDot) {
    // EU format: 1.234,56 → remove dots, replace comma with dot
    normalized = cleaned.replace(/\./g, '').replace(',', '.')
  } else {
    // US format: 1,234.56 → remove commas
    normalized = cleaned.replace(/,/g, '')
  }
  return parseFloat(normalized) || 0
}

export function centsToDollars(cents: number): number {
  return cents / 100
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}
