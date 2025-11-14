"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { MenuItem, MenuItemInsert, MenuItemUpdate } from "@/lib/supabase/types"
import ImageUpload from "@/components/admin/ImageUpload"
import { deleteImage } from "@/lib/supabase/storage"

type MenuCategory = {
  id: string
  name: string
  sort_order: number
  is_active: boolean
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    spicy_level: 0,
    is_bestseller: false,
    image_url: "",
    sort_order: 0,
  })

  useEffect(() => {
    loadCategories()
    loadMenuItems()
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
    }
  }

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('加载菜单失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = filterCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === filterCategory)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : (name === 'price' || name === 'spicy_level' || name === 'sort_order')
          ? value === '' ? '' : Number(value)
          : value
    }))
  }

  const handleOpenForm = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        description: item.description || "",
        spicy_level: item.spicy_level,
        is_bestseller: item.is_bestseller,
        image_url: item.image_url || "",
        sort_order: item.sort_order,
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        category: categories.length > 0 ? categories[0].name : "",
        price: "",
        description: "",
        spicy_level: 0,
        is_bestseller: false,
        image_url: "",
        sort_order: menuItems.length + 1,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const itemData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description || null,
        spicy_level: formData.spicy_level,
        is_bestseller: formData.is_bestseller,
        image_url: formData.image_url || null,
        sort_order: formData.sort_order,
      }

      if (editingItem) {
        // 更新
        const { error } = await supabase
          .from('menu_items')
          .update(itemData as MenuItemUpdate)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        // 新增
        const { error } = await supabase
          .from('menu_items')
          .insert(itemData as MenuItemInsert)

        if (error) throw error
      }

      await loadMenuItems()
      handleCloseForm()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`确定要删除 "${item.name}" 吗？`)) return

    try {
      // 如果有图片，先删除
      if (item.image_url) {
        await deleteImage(item.image_url).catch(console.error)
      }

      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      await loadMenuItems()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const getCategoryLabel = (category: string) => {
    const found = categories.find(cat => cat.name === category)
    return found ? found.name : category
  }

  const SpicyLevel = ({ level }: { level: number }) => {
    return (
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < level ? "text-red-500" : "text-gray-300"}>
            🌶️
          </span>
        ))}
      </div>
    )
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
          <h1 className="text-2xl font-bold text-foreground">菜单管理</h1>
          <p className="text-muted-foreground">管理所有菜品信息</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          添加菜品
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === cat.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-6">
            {/* Image */}
            {item.image_url && (
              <div className="mb-4 h-40 rounded-lg overflow-hidden bg-secondary">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold">{item.name}</h3>
              {item.is_bestseller && (
                <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded">
                  热销
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {getCategoryLabel(item.category)}
                </span>
                <SpicyLevel level={item.spicy_level} />
              </div>
              <p className="text-xl font-bold text-primary">¥{item.price}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenForm(item)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(item)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingItem ? '编辑菜品' : '添加菜品'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">菜品名称 *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">分类 *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    required
                  >
                    {categories.length === 0 && (
                      <option value="">请先在菜单分类管理中添加分类</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">价格 (元) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">辣度 (0-3)</label>
                  <select
                    name="spicy_level"
                    value={formData.spicy_level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="0">不辣</option>
                    <option value="1">微辣 🌶️</option>
                    <option value="2">中辣 🌶️🌶️</option>
                    <option value="3">特辣 🌶️🌶️🌶️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">排序</label>
                  <Input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">菜品描述</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_bestseller"
                  checked={formData.is_bestseller}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">标记为热销菜品</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">菜品图片</label>
                <ImageUpload
                  currentImage={formData.image_url}
                  folder="menu"
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                />
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
