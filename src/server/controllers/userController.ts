import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '../services/userService'
import { roleMiddleware } from '../middlewares/auth'

const userService = new UserService()

export async function getUsers(request: NextRequest) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[UserController] GET /api/users - Fetching all users')
    const users = await userService.getAllUsers()

    if (!users || users.length === 0) {
      console.warn('[UserController] No users found in database')
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('[UserController] Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}

export async function getUser(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log(`[UserController] GET /api/users/${params.id}`)
    const user = await userService.getUserById(params.id)
    if (!user) {
      console.warn(`[UserController] User not found: ${params.id}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error(`[UserController] Error fetching user ${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function createUser(request: NextRequest) {
  const auth = await roleMiddleware('super_admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[UserController] POST /api/users - Creating new user')
    const body = await request.json()
    console.log('[UserController] Request body:', body)

    const user = await userService.createUser(body)
    if (!user) {
      console.error('[UserController] Failed to create user')
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('[UserController] Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function updateUser(request: NextRequest) {
  const auth = await roleMiddleware('super_admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[UserController] PUT /api/users - Updating user')
    const body = await request.json()
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await userService.updateUser(id, body)
    if (!user) {
      console.error('[UserController] Failed to update user')
      return NextResponse.json({ error: 'Failed to update user' }, { status: 400 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('[UserController] Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function deleteUser(request: NextRequest) {
  const auth = await roleMiddleware('super_admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[UserController] DELETE /api/users - Deleting user')
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const success = await userService.deleteUser(id)
    if (!success) {
      console.error('[UserController] Failed to delete user')
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 400 })
    }
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('[UserController] Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}