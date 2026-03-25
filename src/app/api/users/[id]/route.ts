import { updateUser, deleteUser, getUser } from '@/server/controllers/userController'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return getUser(request as any, { params })
}

export async function PUT(request: Request) {
  return updateUser(request as any)
}

export async function DELETE(request: Request) {
  return deleteUser(request as any)
}
