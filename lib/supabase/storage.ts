import { supabase } from './client'

/**
 * 上传图片到 Supabase Storage
 * @param file 文件对象
 * @param folder 存储文件夹（stores 或 menu）
 * @returns 公开访问 URL
 */
export async function uploadImage(
  file: File,
  folder: 'stores' | 'menu'
): Promise<string> {
  try {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('只能上传图片文件')
    }

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('图片大小不能超过 5MB')
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${timestamp}-${randomStr}.${ext}`

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw error
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error: any) {
    console.error('图片上传失败:', error)
    throw new Error(error.message || '图片上传失败')
  }
}

/**
 * 删除图片
 * @param url 图片 URL
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // 从 URL 提取文件路径
    const urlObj = new URL(url)
    const path = urlObj.pathname.split('/storage/v1/object/public/images/')[1]

    if (!path) {
      throw new Error('无效的图片 URL')
    }

    const { error } = await supabase.storage
      .from('images')
      .remove([path])

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('图片删除失败:', error)
    throw new Error(error.message || '图片删除失败')
  }
}

/**
 * 验证图片 URL 是否有效
 */
export function isValidImageUrl(url: string | null): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('supabase')
  } catch {
    return false
  }
}
