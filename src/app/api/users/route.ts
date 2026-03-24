import { getUsers, createUser, updateUser, deleteUser } from '@/server/controllers/userController'

export async function GET(request: Request) {
  return getUsers(request as any)
}

export async function POST(request: Request) {
  return createUser(request as any)
}

export async function PUT(request: Request) {
  return updateUser(request as any)
}

export async function DELETE(request: Request) {
  return deleteUser(request as any)
}