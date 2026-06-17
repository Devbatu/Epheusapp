import { format, parseISO } from 'date-fns'

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, 'dd MMM yyyy HH:mm')
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n)
}

export function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`
}

export function truncate(str: string, maxLen = 50): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}
