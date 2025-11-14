"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { uploadImage } from "@/lib/supabase/storage"

interface ImageUploadProps {
  currentImage?: string | null
  folder: 'stores' | 'menu'
  onUploadComplete: (url: string) => void
  onRemove?: () => void
}

export default function ImageUpload({
  currentImage,
  folder,
  onUploadComplete,
  onRemove,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('只能上传图片文件')
      return
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB')
      return
    }

    // 显示预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 上传
    setIsUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onUploadComplete(url)
    } catch (err: any) {
      setError(err.message || '上传失败')
      setPreview(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview ? (
        <div className="relative w-full aspect-[4/3] border border-border rounded-lg overflow-hidden bg-secondary/20">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {!isUploading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[4/3] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-secondary/20 transition-colors"
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">点击上传图片</p>
          <p className="text-xs text-muted-foreground">支持 JPG, PNG, 最大 5MB</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {/* Upload Button (Alternative) */}
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          选择图片
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
