import { register } from '@/server/controllers/authController'

export async function POST(request: Request) {
  return register(request as any)
}