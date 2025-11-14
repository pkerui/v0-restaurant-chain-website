"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Trash2, Edit, MoveUp, MoveDown, Eye, EyeOff, Star } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Testimonial } from "@/lib/supabase/types"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    avatar: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error('加载评价失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingTestimonial) {
        // 更新现有评价
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: formData.name,
            role: formData.role,
            content: formData.content,
            rating: formData.rating,
            avatar: formData.avatar,
          })
          .eq('id', editingTestimonial.id)

        if (error) throw error
        alert('更新成功！')
      } else {
        // 添加新评价
        const maxOrder = testimonials.length > 0
          ? Math.max(...testimonials.map(t => t.sort_order))
          : 0

        const { error } = await supabase
          .from('testimonials')
          .insert({
            name: formData.name,
            role: formData.role,
            content: formData.content,
            rating: formData.rating,
            avatar: formData.avatar,
            sort_order: maxOrder + 1,
          })

        if (error) throw error
        alert('添加成功！')
      }

      setFormData({ name: "", role: "", content: "", rating: 5, avatar: "" })
      setEditingTestimonial(null)
      setIsAdding(false)
      loadTestimonials()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评价吗？')) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('删除成功！')
      loadTestimonials()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !testimonial.is_active })
        .eq('id', testimonial.id)

      if (error) throw error
      loadTestimonials()
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const moveTestimonial = async (testimonial: Testimonial, direction: 'up' | 'down') => {
    const currentIndex = testimonials.findIndex(t => t.id === testimonial.id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === testimonials.length - 1)
    ) {
      return
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapTestimonial = testimonials[swapIndex]

    try {
      // 交换排序值
      await supabase
        .from('testimonials')
        .update({ sort_order: swapTestimonial.sort_order })
        .eq('id', testimonial.id)

      await supabase
        .from('testimonials')
        .update({ sort_order: testimonial.sort_order })
        .eq('id', swapTestimonial.id)

      loadTestimonials()
    } catch (error: any) {
      console.error('移动失败:', error)
      alert('移动失败: ' + error.message)
    }
  }

  const startEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
    })
    setIsAdding(false)
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingTestimonial(null)
    setFormData({ name: "", role: "", content: "", rating: 5, avatar: "" })
  }

  const cancelEdit = () => {
    setEditingTestimonial(null)
    setIsAdding(false)
    setFormData({ name: "", role: "", content: "", rating: 5, avatar: "" })
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
          <h1 className="text-2xl font-bold text-foreground">顾客评价管理</h1>
          <p className="text-muted-foreground">管理首页"顾客怎么说"部分的评价内容</p>
        </div>
        {!isAdding && !editingTestimonial && (
          <Button onClick={startAdd}>
            <Plus className="w-4 h-4 mr-2" />
            添加评价
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingTestimonial) && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTestimonial ? '编辑评价' : '添加评价'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">顾客姓名 *</label>
                <Input
                  type="text"
                  placeholder="例如：王先生"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">顾客身份 *</label>
                <Input
                  type="text"
                  placeholder="例如：常客"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">头像文字 *</label>
                <Input
                  type="text"
                  placeholder="例如：王"
                  maxLength={2}
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  通常使用姓氏，最多2个字符
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">评分 *</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating} 星
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">评价内容 *</label>
              <Textarea
                placeholder="顾客的评价内容..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  editingTestimonial ? '更新' : '添加'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                取消
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">还没有评价，点击上方按钮添加</p>
          </Card>
        ) : (
          testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className={`p-4 ${!testimonial.is_active ? 'opacity-50' : ''}`}>
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{testimonial.avatar}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">{testimonial.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      排序: {testimonial.sort_order}
                    </span>
                    {testimonial.is_active ? (
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
                      onClick={() => moveTestimonial(testimonial, 'up')}
                      disabled={index === 0}
                      title="上移"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveTestimonial(testimonial, 'down')}
                      disabled={index === testimonials.length - 1}
                      title="下移"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(testimonial)}
                      title={testimonial.is_active ? '禁用' : '启用'}
                    >
                      {testimonial.is_active ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(testimonial)}
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial.id)}
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
