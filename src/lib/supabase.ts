import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

console.log('[Supabase] URL:', supabaseUrl)
console.log('[Supabase] anon key length:', supabaseAnonKey.length)
console.log('[Supabase] service key length:', supabaseServiceKey.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)