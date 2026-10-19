function incrementInteger(digits: string): string {
  let carry = 1
  const out: string[] = []
  for (let i = digits.length - 1; i >= 0; i--) {
    const sum = digits.charCodeAt(i) - 48 + carry
    out.push(String(sum % 10))
    carry = sum >= 10 ? 1 : 0
  }
  if (carry) out.push('1')
  return out.reverse().join('')
}

function decimalInput(
  value: string | number | null | undefined
): string | null | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : null
  }
  return value
}

/** Round a decimal string without converting it through a JS number. */
export function formatDecimal(
  value: string | number | null | undefined,
  fractionDigits = 2
): string {
  const digits = Math.max(0, Math.trunc(fractionDigits))
  const zero = digits === 0 ? '0' : `0.${'0'.repeat(digits)}`
  const input = decimalInput(value)

  if (input == null) return zero
  const trimmed = input.trim()
  if (!trimmed) return zero

  const negative = trimmed.startsWith('-')
  const unsigned = trimmed.slice(negative ? 1 : 0)
  if (!/^\d+(\.\d+)?$/.test(unsigned)) return zero

  const [intRaw, fracRaw = ''] = unsigned.split('.')
  const intPart = intRaw.replace(/^0+(?=\d)/, '') || '0'
  const probe = `${fracRaw}${'0'.repeat(digits + 1)}`.slice(0, digits + 1)
  let kept = probe.slice(0, digits)
  const roundUp = (probe[digits] ?? '0') >= '5'

  let nextInt = intPart
  if (roundUp) {
    const bumped = incrementInteger(`${intPart}${kept}`)
    if (digits === 0) {
      nextInt = bumped
      kept = ''
    } else {
      nextInt = bumped.slice(0, -digits) || '0'
      kept = bumped.slice(-digits)
    }
  }

  const body = digits === 0 ? nextInt : `${nextInt}.${kept}`
  if (negative && body !== zero) return `-${body}`
  return body
}

export function formatUsd(value: string | number | null | undefined): string {
  const formatted = formatDecimal(value, 2)
  if (formatted.startsWith('-')) return `-$${formatted.slice(1)}`
  return `$${formatted}`
}

/** Chart.js datasets need a JS number. Use this only while building chart data. */
export function toChartNumber(
  value: string | number | null | undefined
): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (value == null || value.trim() === '') return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
