"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Loader2, X, MoveUp, MoveDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type MenuTip = Database['public']['Tables']['menu_tips']['Row']
type MenuTipInsert = Database['public']['Tables']['menu_tips']['Insert']
type MenuTipUpdate = Database['public']['Tables']['menu_tips']['Update']

export default function MenuTipsPage() {
  const [tips, setTips] = useState<MenuTip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTip, setEditingTip] = useState<MenuTip | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    content: "",
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    loadTips()
  }, [])

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_tips')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setTips(data || [])
    } catch (error) {
      console.error('加载小贴士失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : name === 'sort_order'
          ? value === '' ? 0 : Number(value)
          : value
    }))
  }

  const handleOpenForm = (tip?: MenuTip) => {
    if (tip) {
      setEditingTip(tip)
      setFormData({
        content: tip.content,
        sort_order: tip.sort_order,
        is_active: tip.is_active,
      })
    } else {
      setEditingTip(null)
      setFormData({
        content: "",
        sort_order: tips.length + 1,
        is_active: true,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTip(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tipData = {
        content: formData.content,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      }

      if (editingTip) {
        // 更新
        const { error } = await supabase
          .from('menu_tips')
          .update(tipData as MenuTipUpdate)
          .eq('id', editingTip.id)

        if (error) throw error
      } else {
        // 新增
        const { error } = await supabase
          .from('menu_tips')
          .insert(tipData as MenuTipInsert)

        if (error) throw error
      }

      await loadTips()
      handleCloseForm()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (tip: MenuTip) => {
    if (!confirm(`确定要删除这条小贴士吗？\n\n"${tip.content}"`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('menu_tips')
        .delete()
        .eq('id', tip.id)

      if (error) throw error

      await loadTips()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const handleToggleActive = async (tip: MenuTip) => {
    try {
      const { error } = await supabase
        .from('menu_tips')
        .update({ is_active: !tip.is_active })
        .eq('id', tip.id)

      if (error) throw error

      await loadTips()
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const handleMoveSortOrder = async (tip: MenuTip, direction: 'up' | 'down') => {
    const currentIndex = tips.findIndex(t => t.id === tip.id)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= tips.length) return

    const targetTip = tips[targetIndex]

    try {
      // 交换两个小贴士的排序顺序
      const updates = [
        supabase
          .from('menu_tips')
          .update({ sort_order: targetTip.sort_order })
          .eq('id', tip.id),
        supabase
          .from('menu_tips')
          .update({ sort_order: tip.sort_order })
          .eq('id', targetTip.id)
      ]

      const results = await Promise.all(updates)

      if (results.some(result => result.error)) {
        throw new Error('排序更新失败')
      }

      await loadTips()
    } catch (error: any) {
      console.error('排序失败:', error)
      alert('排序失败: ' + error.message)
    }
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
          <h1 className="text-2xl font-bold text-foreground">用餐小贴士管理</h1>
          <p className="text-muted-foreground">管理菜单页面显示的用餐小贴士</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          添加小贴士
        </Button>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">ℹ️</div>
          <div className="text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              使用说明
            </p>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 小贴士会显示在菜单页面底部</li>
              <li>• 使用上下箭头调整显示顺序</li>
              <li>• 禁用的小贴士不会在前台显示</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips List */}
      <div className="grid gap-4">
        {tips.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">还没有小贴士，点击上方按钮添加第一条</p>
          </Card>
        ) : (
          tips.map((tip, index) => (
            <Card key={tip.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Sort Order Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveSortOrder(tip, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向上移动"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSortOrder(tip, 'down')}
                      disabled={index === tips.length - 1}
                      className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向下移动"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tip Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-muted-foreground">
                        排序: {tip.sort_order}
                      </span>
                      {!tip.is_active && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          已禁用
                        </span>
                      )}
                    </div>
                    <p className="text-foreground">• {tip.content}</p>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {tip.is_active ? '已启用' : '已禁用'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(tip)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        tip.is_active ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tip.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenForm(tip)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tip)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingTip ? '编辑小贴士' : '添加小贴士'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  小贴士内容 *
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="例如: 我们的所有菜品均采用新鲜食材，每日采购"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">排序顺序</label>
                <Input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  数字越小越靠前显示
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">启用此小贴士</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
