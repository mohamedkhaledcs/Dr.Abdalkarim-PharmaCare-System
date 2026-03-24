import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/userRepository'
import { User } from '@/types'

const userRepository = new UserRepository()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export class AuthService {
  async register(userData: { 
    name: string
    email: string
    phone?: string
    password: string
    role?: 'admin' | 'cashier' | 'user' 
  }): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
    try {
      console.log(`[AuthService] Registering user: ${userData.email}`)

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email)
      if (existingUser) {
        console.warn(`[AuthService] User already exists: ${userData.email}`)
        return null
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await userRepository.create({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user',
      })

      if (!user) {
        console.error('[AuthService] Failed to create user')
        return null
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log(`[AuthService] User registered successfully: ${user.email}`)
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          created_at: user.created_at,
        },
        token,
      }
    } catch (error) {
      console.error('[AuthService] Error during registration:', error)
      return null
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
    try {
      console.log(`[AuthService] Login attempt: ${email}`)

      const user = await userRepository.findByEmail(email)
      if (!user) {
        console.warn(`[AuthService] User not found: ${email}`)
        return null
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.warn(`[AuthService] Invalid password for: ${email}`)
        return null
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log(`[AuthService] Login successful: ${email}`)
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          created_at: user.created_at,
        },
        token,
      }
    } catch (error) {
      console.error('[AuthService] Error during login:', error)
      return null
    }
  }

  async verifyToken(token: string): Promise<any | null> {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      console.error('[AuthService] Invalid token:', error)
      return null
    }
  }
}