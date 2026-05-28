import jwt from 'jsonwebtoken'

export interface JWTPayload {
  id: string
  email: string
  tier: 'free' | 'premium'
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export function extractToken(authHeader: string | undefined): JWTPayload | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  try { return verifyToken(authHeader.split(' ')[1]) }
  catch { return null }
}
