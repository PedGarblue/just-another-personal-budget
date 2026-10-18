const CATEGORY_FILL_ALPHA = 0.3

export function convertColorValueToTailwindCompatible(color: string) {
  if (!color) return ''

  if (color.startsWith('#')) {
    let hex = color.slice(1)
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((channel) => channel + channel)
        .join('')
    }
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${CATEGORY_FILL_ALPHA})`
  }

  const channels = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (channels) {
    return `rgba(${channels[1]}, ${channels[2]}, ${channels[3]}, ${CATEGORY_FILL_ALPHA})`
  }

  return color
}
