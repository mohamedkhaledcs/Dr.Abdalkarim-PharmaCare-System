import { UserRepository } from '../repositories/userRepository'
import { User } from '@/types'
import bcrypt from 'bcryptjs'

const userRepository = new UserRepository()

export class UserService {
  async getAllUsers(): Promise<User[]> {
    console.log('[UserService] Getting all users')
    const users = await userRepository.findAll()
    console.log(`[UserService] Retrieved ${users.length} users`)
    return users
  }

  async getUserById(id: string): Promise<User | null> {
    console.log(`[UserService] Getting user by ID: ${id}`)
    return userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.log(`[UserService] Getting user by email: ${email}`)
    return userRepository.findByEmail(email)
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    console.log(`[UserService] Creating user: ${user.email}`)

    // Check if user already exists
    const existing = await this.getUserByEmail(user.email)
    if (existing) {
      console.warn('[UserService] User already exists with email:', user.email)
      return null
    }

    if (!user.password) {
      console.error('[UserService] Password is required for user creation')
      return null
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const userWithHashedPassword = { ...user, password: hashedPassword }

    return userRepository.create(userWithHashedPassword)
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    console.log(`[UserService] Updating user ${id}`)

    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10)
    }

    return userRepository.update(id, updates)
  }

  async deleteUser(id: string): Promise<boolean> {
    console.log(`[UserService] Deleting user ${id}`)
    return userRepository.delete(id)
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    console.log(`[UserService] Validating password for: ${email}`)
    const user = await this.getUserByEmail(email)
    if (!user || !user.password) return null

    const isValid = await bcrypt.compare(password, user.password)
    return isValid ? user : null
  }
}