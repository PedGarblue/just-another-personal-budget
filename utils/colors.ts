export function convertColorValueToTailwindCompatible(color: string) {
  if (!color) return ''

  if (color.startsWith('#')) {
    // Convert HEX to RGB
    const bigint = parseInt(color.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, var(--tw-bg-opacity))`
  } else if (color.startsWith('rgb')) {
    // Assuming the color is already in RGB
    return color.replace('rgb', 'rgba').replace(')', ', var(--tw-bg-opacity))')
  }

  // Fallback to the original color
  return color
}
