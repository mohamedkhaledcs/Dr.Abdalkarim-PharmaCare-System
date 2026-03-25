import { NextResponse } from 'next/server'
import { UserRepository } from '@/server/repositories/userRepository'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const repo = new UserRepository()
    
    // Wipe all users
    const users = await repo.findAll()
    for (const u of users) {
      if (u.id) await repo.delete(u.id)
    }

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin1234Testa@', 10)
    await repo.create({
      name: 'Admin',
      email: 'admin@admin.com', // used for login
      password: hashedPassword,
      role: 'admin',
      phone: '01068186019'
    })

    return NextResponse.json({ success: true, message: 'All users wiped and Admin created successfully. Login with email: admin@admin.com and password: admin1234Testa@' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
