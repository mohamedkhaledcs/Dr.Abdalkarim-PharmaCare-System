import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { User } from '@/types'

const usersFilePath = path.resolve(process.cwd(), 'data', 'users.json')

type UserWithPassword = User & { password?: string }

async function readUsersFromFile(): Promise<{ users: UserWithPassword[] }> {
  try {
    const raw = await fs.readFile(usersFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    return { users: [] }
  }
}

async function writeUsersToFile(data: { users: UserWithPassword[] }): Promise<void> {
  await fs.mkdir(path.dirname(usersFilePath), { recursive: true })
  await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf-8')
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    const db = await readUsersFromFile()
    return db.users.map(({ password, ...rest }) => rest)
  }

  async findByEmail(email: string): Promise<(User & { password: string }) | null> {
    const db = await readUsersFromFile()
    const user = db.users.find(u => u.email === email)
    if (!user || (!user.password && user.password !== '')) return null
    return user as User & { password: string }
  }

  async findById(id: string): Promise<User | null> {
    const db = await readUsersFromFile()
    const user = db.users.find(u => u.id === id)
    if (!user) return null
    const { password, ...rest } = user
    return rest
  }

  async create(user: Omit<User, 'id' | 'created_at'> & { password: string }): Promise<(User & { password: string }) | null> {
    try {
      const db = await readUsersFromFile()
      const newUser: UserWithPassword = {
        ...user,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }
      db.users.unshift(newUser)
      await writeUsersToFile(db)
      return newUser as User & { password: string }
    } catch (e) { return null }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const db = await readUsersFromFile()
    const index = db.users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    db.users[index] = { ...db.users[index], ...updates }
    await writeUsersToFile(db)
    
    const { password, ...rest } = db.users[index]
    return rest
  }

  async delete(id: string): Promise<boolean> {
    const db = await readUsersFromFile()
    const initialLength = db.users.length
    db.users = db.users.filter(u => u.id !== id)
    
    if (db.users.length < initialLength) {
      await writeUsersToFile(db)
      return true
    }
    return false
  }

  async findByRole(role: 'admin' | 'cashier' | 'user'): Promise<User[]> {
    const db = await readUsersFromFile()
    const users = db.users.filter(u => u.role === role)
    return users.map(({ password, ...rest }) => rest)
  }
}