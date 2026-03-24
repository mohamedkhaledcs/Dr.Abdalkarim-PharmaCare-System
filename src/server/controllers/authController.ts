import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../services/authService'

const authService = new AuthService()

export async function register(request: NextRequest) {
  try {
    const { name, email, phone, password, adminCode } = await request.json()

    console.log(`[AuthController] Registration attempt: ${email}`)

    // Validate required fields
    if (!name || !email || !password) {
      console.warn('[AuthController] Missing required fields')
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      console.warn('[AuthController] Password too short')
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }

    // Determine role based on admin code
    let role: 'admin' | 'user' = 'user'
    const ADMIN_CODE = process.env.ADMIN_REGISTER_CODE || 'admin123'

    if (adminCode && adminCode === ADMIN_CODE) {
      role = 'admin'
      console.log(`[AuthController] Admin registration confirmed for: ${email}`)
    } else if (adminCode) {
      console.warn(`[AuthController] Invalid admin code provided for: ${email}`)
      return NextResponse.json(
        { error: 'كود المسؤول غير صحيح' },
        { status: 400 }
      )
    }

    const result = await authService.register({
      name,
      email,
      phone,
      password,
      role,
    })

    if (!result) {
      console.error('[AuthController] Registration failed')
      return NextResponse.json(
        { error: 'فشل التسجيل. قد يكون البريد الإلكتروني مسجلاً بالفعل' },
        { status: 400 }
      )
    }

    console.log(`[AuthController] Registration successful for: ${email} (${role})`)
    return NextResponse.json({
      message: 'تم التسجيل بنجاح',
      user: result.user,
      token: result.token,
    })
  } catch (error) {
    console.error('[AuthController] Error during registration:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function login(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log(`[AuthController] Login attempt: ${email}`)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'يجب ملء البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      )
    }

    const result = await authService.login(email, password)
    
    if (!result) {
      console.warn(`[AuthController] Login failed: ${email}`)
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    console.log(`[AuthController] Login successful: ${email} (${result.user.role})`)
    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: result.user,
      token: result.token,
    })
  } catch (error) {
    console.error('[AuthController] Error during login:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}