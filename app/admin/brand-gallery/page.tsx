"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2, Edit, MoveUp, MoveDown, Eye, EyeOff, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { BrandGalleryImage } from "@/lib/supabase/types"

export default function BrandGalleryPage() {
  const [images, setImages] = useState<BrandGalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingImage, setEditingImage] = useState<BrandGalleryImage | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_gallery')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('加载图片失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('请上传 JPG、PNG 或 WebP 格式的图片')
      return
    }

    // 验证文件大小 (限制5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    setSelectedFile(file)
    setIsUploading(true)

    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `brand-gallery/${fileName}`

      // 上传到 Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // 获取公共 URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      // 更新表单数据
      setFormData({ ...formData, image_url: publicUrl })
      alert('图片上传成功！')
    } catch (error: any) {
      console.error('上传失败:', error)
      alert('上传失败: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingImage) {
        // 更新现有图片
        const { error } = await supabase
          .from('brand_gallery')
          .update({
            image_url: formData.image_url,
            alt_text: formData.alt_text,
          })
          .eq('id', editingImage.id)

        if (error) throw error
        alert('更新成功！')
      } else {
        // 添加新图片
        const maxOrder = images.length > 0
          ? Math.max(...images.map(img => img.sort_order))
          : 0

        const { error } = await supabase
          .from('brand_gallery')
          .insert({
            image_url: formData.image_url,
            alt_text: formData.alt_text,
            sort_order: maxOrder + 1,
          })

        if (error) throw error
        alert('添加成功！')
      }

      setFormData({ image_url: "", alt_text: "" })
      setEditingImage(null)
      setIsAdding(false)
      loadImages()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这张图片吗？')) return

    try {
      const { error } = await supabase
        .from('brand_gallery')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('删除成功！')
      loadImages()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const toggleActive = async (image: BrandGalleryImage) => {
    try {
      const { error } = await supabase
        .from('brand_gallery')
        .update({ is_active: !image.is_active })
        .eq('id', image.id)

      if (error) throw error
      loadImages()
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const moveImage = async (image: BrandGalleryImage, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === image.id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === images.length - 1)
    ) {
      return
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapImage = images[swapIndex]

    try {
      // 交换排序值
      await supabase
        .from('brand_gallery')
        .update({ sort_order: swapImage.sort_order })
        .eq('id', image.id)

      await supabase
        .from('brand_gallery')
        .update({ sort_order: image.sort_order })
        .eq('id', swapImage.id)

      loadImages()
    } catch (error: any) {
      console.error('移动失败:', error)
      alert('移动失败: ' + error.message)
    }
  }

  const startEdit = (image: BrandGalleryImage) => {
    setEditingImage(image)
    setFormData({
      image_url: image.image_url,
      alt_text: image.alt_text,
    })
    setIsAdding(false)
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingImage(null)
    setFormData({ image_url: "", alt_text: "" })
  }

  const cancelEdit = () => {
    setEditingImage(null)
    setIsAdding(false)
    setFormData({ image_url: "", alt_text: "" })
    setSelectedFile(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">品牌风采图片管理</h1>
          <p className="text-muted-foreground">管理"关于我们"页面的品牌风采轮播图片</p>
        </div>
        {!isAdding && !editingImage && (
          <Button onClick={startAdd}>
            <Plus className="w-4 h-4 mr-2" />
            添加图片
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingImage) && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingImage ? '编辑图片' : '添加图片'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">上传图片</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    支持 JPG、PNG、WebP 格式，文件大小不超过 5MB
                  </p>
                </div>
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    上传中...
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">或者</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">图片URL</label>
              <Input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                也可以直接输入外部图片链接
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">图片描述</label>
              <Input
                type="text"
                placeholder="例如：地道潮汕牛肉粿汁"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                required
              />
            </div>
            {formData.image_url && (
              <div>
                <label className="block text-sm font-medium mb-2">图片预览</label>
                <div className="w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt={formData.alt_text}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  editingImage ? '更新' : '添加'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                取消
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Images List */}
      <div className="grid gap-4">
        {images.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">还没有图片，点击上方按钮添加</p>
          </Card>
        ) : (
          images.map((image, index) => (
            <Card key={image.id} className={`p-4 ${!image.is_active ? 'opacity-50' : ''}`}>
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0 w-32 aspect-[4/3] rounded overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{image.alt_text}</h3>
                  <p className="text-sm text-muted-foreground truncate">{image.image_url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      排序: {image.sort_order}
                    </span>
                    {image.is_active ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        已启用
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        已禁用
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(image, 'up')}
                      disabled={index === 0}
                      title="上移"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(image, 'down')}
                      disabled={index === images.length - 1}
                      title="下移"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(image)}
                      title={image.is_active ? '禁用' : '启用'}
                    >
                      {image.is_active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(image)}
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(image.id)}
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
