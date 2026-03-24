import { supabase } from '@/lib/supabase'
import { User } from '@/types'

export class UserRepository {
  async findAll(): Promise<User[]> {
    try {
      console.log('[UserRepository] Finding all users')
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[UserRepository] Error finding all users:', error.message)
        return []
      }

      if (!data) {
        console.warn('[UserRepository] No users found')
        return []
      }

      console.log(`[UserRepository] Found ${data.length} users`)
      return data as User[]
    } catch (error) {
      console.error('[UserRepository] Unexpected error finding all users:', error)
      return []
    }
  }

  async findByEmail(email: string): Promise<(User & { password: string }) | null> {
    try {
      console.log(`[UserRepository] Finding user by email: ${email}`)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error(`[UserRepository] Error finding user by email:`, error.message)
        return null
      }

      if (!data) {
        console.warn(`[UserRepository] User not found: ${email}`)
        return null
      }

      console.log(`[UserRepository] User found: ${email}`)
      return data as User & { password: string }
    } catch (error) {
      console.error('[UserRepository] Unexpected error finding user:', error)
      return null
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      console.log(`[UserRepository] Finding user by ID: ${id}`)
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role, created_at')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[UserRepository] Error finding user by ID:', error.message)
        return null
      }

      if (!data) {
        console.warn(`[UserRepository] User not found with ID: ${id}`)
        return null
      }

      console.log(`[UserRepository] User found by ID: ${id}`)
      return data as User
    } catch (error) {
      console.error('[UserRepository] Unexpected error finding user by ID:', error)
      return null
    }
  }

  async create(user: Omit<User, 'id' | 'created_at'> & { password: string }): Promise<(User & { password: string }) | null> {
    try {
      console.log(`[UserRepository] Creating user: ${user.email}`)
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()

      if (error) {
        console.error('[UserRepository] Error creating user:', error.message)
        return null
      }

      if (!data) {
        console.warn('[UserRepository] No data returned after user creation')
        return null
      }

      console.log(`[UserRepository] User created: ${user.email}`)
      return data as User & { password: string }
    } catch (error) {
      console.error('[UserRepository] Unexpected error creating user:', error)
      return null
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      console.log(`[UserRepository] Updating user: ${id}`)
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('id, name, email, phone, role, created_at')
        .single()

      if (error) {
        console.error('[UserRepository] Error updating user:', error.message)
        return null
      }

      if (!data) {
        console.warn(`[UserRepository] User not found for update: ${id}`)
        return null
      }

      console.log(`[UserRepository] User updated: ${id}`)
      return data as User
    } catch (error) {
      console.error('[UserRepository] Unexpected error updating user:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      console.log(`[UserRepository] Deleting user: ${id}`)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[UserRepository] Error deleting user:', error.message)
        return false
      }

      console.log(`[UserRepository] User deleted: ${id}`)
      return true
    } catch (error) {
      console.error('[UserRepository] Unexpected error deleting user:', error)
      return false
    }
  }

  async findByRole(role: 'admin' | 'cashier' | 'user'): Promise<User[]> {
    try {
      console.log(`[UserRepository] Finding users with role: ${role}`)
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role, created_at')
        .eq('role', role)

      if (error) {
        console.error('[UserRepository] Error finding users by role:', error.message)
        return []
      }

      if (!data) {
        console.warn(`[UserRepository] No users found with role: ${role}`)
        return []
      }

      console.log(`[UserRepository] Found ${data.length} users with role: ${role}`)
      return data as User[]
    } catch (error) {
      console.error('[UserRepository] Unexpected error finding users by role:', error)
      return []
    }
  }
}