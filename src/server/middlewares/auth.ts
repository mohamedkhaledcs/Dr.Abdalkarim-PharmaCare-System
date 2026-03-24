import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../services/authService'

const authService = new AuthService()

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await authService.verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return payload
}

export function roleMiddleware(requiredRole: string) {
  return async (request: NextRequest) => {
    const payload = await authMiddleware(request)
    if (payload instanceof NextResponse) return payload

    if (payload.role !== requiredRole && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return payload
  }
}