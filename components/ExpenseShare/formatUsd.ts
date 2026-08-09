export function formatUsd(value: string | number | null | undefined): string {
  return `$${Number(value ?? 0).toFixed(2)}`
}
