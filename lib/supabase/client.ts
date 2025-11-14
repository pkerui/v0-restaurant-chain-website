import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 验证环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// 验证 URL 格式（避免使用占位符）
if (supabaseUrl.includes('placeholder')) {
  console.warn(
    '⚠️  Warning: Using placeholder Supabase URL. Please configure real credentials in .env.local'
  )
}

/**
 * 创建 Supabase 客户端实例
 * 用于客户端组件和页面
 *
 * 特点：
 * - 使用 anon key（公开安全，受 RLS 保护）
 * - 自动处理认证状态
 * - 支持实时订阅
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * 创建服务端 Supabase 客户端
 * 仅用于服务器端 API 路由
 *
 * ⚠️ 警告：此客户端拥有完全权限，绕过 RLS
 * 只在可信的服务器端代码中使用
 */
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * 检查当前用户是否为管理员
 */
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

/**
 * 获取当前用户配置
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
