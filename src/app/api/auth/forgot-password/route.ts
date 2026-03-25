import { NextResponse } from 'next/server'
import { UserRepository } from '@/server/repositories/userRepository'
import fs from 'fs/promises'
import path from 'path'
import { emailService } from '@/server/services/emailService'

const userRepository = new UserRepository()
const tokensFilePath = path.resolve(process.cwd(), 'data', 'reset_tokens.json')

function generateRandomToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
  let token = ''
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const user = await userRepository.findByEmail(email)
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ message: 'إذا كان البريد مسجلاً، سيتم إرسال رابط التعيين له' })
    }

    // Generate Token
    const token = generateRandomToken()
    
    // Save Token to Local JSON
    let tokens: any = {}
    try {
      const raw = await fs.readFile(tokensFilePath, 'utf-8')
      tokens = JSON.parse(raw)
    } catch (e) {
      // File doesn't exist yet, it's fine
    }
    
    tokens[token] = {
      email: user.email,
      expires: Date.now() + 1000 * 60 * 60 // 1 hour expiry
    }
    
    await fs.mkdir(path.dirname(tokensFilePath), { recursive: true })
    await fs.writeFile(tokensFilePath, JSON.stringify(tokens, null, 2))

    // Send real email via our service
    const emailSent = await emailService.sendPasswordResetEmail(user.email, user.name, token)

    if (!emailSent) {
      return NextResponse.json({ error: 'تعذر إرسال الإيميل' }, { status: 500 })
    }

    return NextResponse.json({ message: 'تم إرسال الإيميل بنجاح' })
  } catch (error) {
    console.error('[ForgotPasswordRoute] Error:', error)
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
