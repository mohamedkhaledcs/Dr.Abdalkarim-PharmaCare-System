import { login } from '@/server/controllers/authController'

export async function POST(request: Request) {
  return login(request as any)
}