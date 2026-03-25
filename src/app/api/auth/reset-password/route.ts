import { NextResponse } from 'next/server'
import { UserRepository } from '@/server/repositories/userRepository'
import fs from 'fs/promises'
import path from 'path'

const userRepository = new UserRepository()
const tokensFilePath = path.resolve(process.cwd(), 'data', 'reset_tokens.json')

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'الكود وكلمة المرور الجديدة مطلوبان' }, { status: 400 })
    }

    let tokens: any = {}
    try {
      const raw = await fs.readFile(tokensFilePath, 'utf-8')
      tokens = JSON.parse(raw)
    } catch (e) {
      return NextResponse.json({ error: 'الكود غير صالح أو منتهي الصلاحية' }, { status: 400 })
    }

    const tokenData = tokens[token]
    if (!tokenData || tokenData.expires < Date.now()) {
      return NextResponse.json({ error: 'الكود غير صالح أو منتهي الصلاحية' }, { status: 400 })
    }

    const user = await userRepository.findByEmail(tokenData.email)
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // Update password
    await userRepository.update(user.id, { password: newPassword })
    
    // Invalidate token
    delete tokens[token]
    await fs.writeFile(tokensFilePath, JSON.stringify(tokens, null, 2))

    return NextResponse.json({ message: 'تم إعادة تعيين كلمة المرور بنجاح' })
  } catch (error) {
    console.error('[ResetPasswordRoute] Error:', error)
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 })
  }
}
