"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Loader2, X, MoveUp, MoveDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type MenuCategory = Database['public']['Tables']['menu_categories']['Row']
type MenuCategoryInsert = Database['public']['Tables']['menu_categories']['Insert']
type MenuCategoryUpdate = Database['public']['Tables']['menu_categories']['Update']

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : name === 'sort_order'
          ? value === '' ? 0 : Number(value)
          : value
    }))
  }

  const handleOpenForm = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        sort_order: category.sort_order,
        is_active: category.is_active,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        sort_order: categories.length + 1,
        is_active: true,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const categoryData = {
        name: formData.name,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      }

      if (editingCategory) {
        // 如果修改了分类名称，需要同步更新所有使用该分类的菜品
        if (editingCategory.name !== formData.name) {
          const { error: menuError } = await supabase
            .from('menu_items')
            .update({ category: formData.name })
            .eq('category', editingCategory.name)

          if (menuError) throw menuError
        }

        // 更新分类
        const { error } = await supabase
          .from('menu_categories')
          .update(categoryData as MenuCategoryUpdate)
          .eq('id', editingCategory.id)

        if (error) throw error
      } else {
        // 新增
        const { error } = await supabase
          .from('menu_categories')
          .insert(categoryData as MenuCategoryInsert)

        if (error) throw error
      }

      await loadCategories()
      handleCloseForm()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (category: MenuCategory) => {
    if (!confirm(`确定要删除分类 "${category.name}" 吗？\n\n注意：删除前请确保没有菜品使用此分类。`)) {
      return
    }

    try {
      // 检查是否有菜品使用此分类
      const { data: menuItems, error: checkError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('category', category.name)
        .limit(1)

      if (checkError) throw checkError

      if (menuItems && menuItems.length > 0) {
        alert('无法删除：仍有菜品使用此分类。请先将这些菜品改为其他分类。')
        return
      }

      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', category.id)

      if (error) throw error

      await loadCategories()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const handleToggleActive = async (category: MenuCategory) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id)

      if (error) throw error

      await loadCategories()
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const handleMoveSortOrder = async (category: MenuCategory, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === category.id)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const targetCategory = categories[targetIndex]

    try {
      // 交换两个分类的排序顺序
      const updates = [
        supabase
          .from('menu_categories')
          .update({ sort_order: targetCategory.sort_order })
          .eq('id', category.id),
        supabase
          .from('menu_categories')
          .update({ sort_order: category.sort_order })
          .eq('id', targetCategory.id)
      ]

      const results = await Promise.all(updates)

      if (results.some(result => result.error)) {
        throw new Error('排序更新失败')
      }

      await loadCategories()
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
          <h1 className="text-2xl font-bold text-foreground">菜单分类管理</h1>
          <p className="text-muted-foreground">管理菜单分类，支持自定义分类和排序</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          添加分类
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
              <li>• <strong>分类名称</strong>：直接输入中文名称（如 主食、配菜、甜品）</li>
              <li>• <strong>排序</strong>：数字越小越靠前，可使用上下箭头快速调整</li>
              <li>• <strong>启用/禁用</strong>：禁用的分类不会在前台显示</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">还没有分类，点击上方按钮添加第一个分类</p>
          </Card>
        ) : (
          categories.map((category, index) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Sort Order Controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveSortOrder(category, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向上移动"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSortOrder(category, 'down')}
                      disabled={index === categories.length - 1}
                      className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向下移动"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{category.name}</h3>
                      {!category.is_active && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          已禁用
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      排序顺序: {category.sort_order}
                    </p>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category.is_active ? '已启用' : '已禁用'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(category)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        category.is_active ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          category.is_active ? 'translate-x-6' : 'translate-x-1'
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
                    onClick={() => handleOpenForm(category)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category)}
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
                {editingCategory ? '编辑分类' : '添加分类'}
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
                  分类名称 *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="例如: 甜品、开胃菜、汤品"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  提示：修改分类名称会同时更新所有使用此分类的菜品
                </p>
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
                <label className="text-sm font-medium">启用此分类</label>
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
