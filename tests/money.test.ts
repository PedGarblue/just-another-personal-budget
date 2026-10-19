import { describe, expect, it } from 'vitest'
import { formatDecimal, formatUsd, toChartNumber } from '../src/utils/money'

describe('formatDecimal', () => {
  it('keeps two fraction digits on a decimal string', () => {
    expect(formatDecimal('12')).toBe('12.00')
    expect(formatDecimal('1.2')).toBe('1.20')
    expect(formatDecimal('  10.50  ')).toBe('10.50')
  })

  it('rounds in decimal space', () => {
    expect(formatDecimal('1.005')).toBe('1.01')
    expect(formatDecimal('1.004')).toBe('1.00')
    expect(formatDecimal('9.995')).toBe('10.00')
    expect(formatDecimal('0.999')).toBe('1.00')
  })

  it('normalizes empty and negative zero', () => {
    expect(formatDecimal(null)).toBe('0.00')
    expect(formatDecimal('')).toBe('0.00')
    expect(formatDecimal('-0.004')).toBe('0.00')
    expect(formatDecimal('-1.2')).toBe('-1.20')
  })
})

describe('formatUsd', () => {
  it('prefixes a dollar sign without using binary float rounding', () => {
    expect(formatUsd('1.005')).toBe('$1.01')
    expect(formatUsd('-1.2')).toBe('-$1.20')
    expect(formatUsd(undefined)).toBe('$0.00')
    expect(formatUsd(1.2)).toBe('$1.20')
  })
})

describe('toChartNumber', () => {
  it('converts a decimal string or JSON number for chart datasets', () => {
    expect(toChartNumber('12.50')).toBe(12.5)
    expect(toChartNumber(12.5)).toBe(12.5)
    expect(toChartNumber(0)).toBe(0)
    expect(toChartNumber(null)).toBe(0)
    expect(toChartNumber('nope')).toBe(0)
  })
})
