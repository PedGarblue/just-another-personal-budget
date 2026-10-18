export const apiUrl = import.meta.env.VITE_API_URL || ''

export const tokenLifetime = {
  accessExpires: 60 * 60 * 1000,
  refreshExpires: 24 * 3600 * 1000,
}
