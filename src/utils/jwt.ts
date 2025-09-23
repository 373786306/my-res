export interface JwtPayload {
  exp?: number
  iat?: number
  role?: string
  [key: string]: any
}

export function decodeJwt(token: string | null): JwtPayload | null {
  try {
    if (token != null) {
     const base64Url = token.split('.')[1]
     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
     const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
    }
    return null
  } catch (e) {
    console.error('Invalid JWT token')
    return null
  }
}