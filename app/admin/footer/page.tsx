"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Loader2, X, MoveUp, MoveDown, Save } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type ContactInfo = Database['public']['Tables']['contact_info']['Row']
type ContactInfoInsert = Database['public']['Tables']['contact_info']['Insert']
type ContactInfoUpdate = Database['public']['Tables']['contact_info']['Update']
type FooterConfig = Database['public']['Tables']['footer_config']['Row']
type FooterConfigUpdate = Database['public']['Tables']['footer_config']['Update']

// 可用的图标列表
const ICON_OPTIONS = [
  { value: 'Phone', label: '电话 📞' },
  { value: 'Mail', label: '邮件 ✉️' },
  { value: 'MapPin', label: '地址 📍' },
  { value: 'Clock', label: '时间 🕐' },
  { value: 'Globe', label: '网站 🌐' },
  { value: 'MessageCircle', label: '消息 💬' },
]

export default function FooterManagementPage() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null)
  const [contactItems, setContactItems] = useState<ContactInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingBrand, setIsSavingBrand] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContactInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 品牌介绍表单
  const [brandData, setBrandData] = useState({
    brand_name: "",
    brand_description: "",
  })

  // 联系信息表单
  const [contactFormData, setContactFormData] = useState({
    icon: "Phone",
    label: "",
    value: "",
    link: "",
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // 加载 Footer 配置
      const { data: configData, error: configError } = await supabase
        .from('footer_config')
        .select('*')
        .limit(1)
        .single()

      if (configError && configError.code !== 'PGRST116') throw configError

      if (configData) {
        setFooterConfig(configData)
        setBrandData({
          brand_name: configData.brand_name,
          brand_description: configData.brand_description,
        })
      }

      // 加载联系信息
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .select('*')
        .order('sort_order', { ascending: true })

      if (contactError) throw contactError
      setContactItems(contactData || [])
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBrandData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveBrand = async () => {
    setIsSavingBrand(true)
    try {
      if (footerConfig) {
        // 更新现有配置
        const { error } = await supabase
          .from('footer_config')
          .update(brandData as FooterConfigUpdate)
          .eq('id', footerConfig.id)

        if (error) throw error
      } else {
        // 创建新配置
        const { error } = await supabase
          .from('footer_config')
          .insert(brandData)

        if (error) throw error
      }

      await loadData()
      alert('品牌介绍保存成功！')
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSavingBrand(false)
    }
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setContactFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : name === 'sort_order'
          ? value === '' ? 0 : Number(value)
          : value
    }))
  }

  const handleOpenContactForm = (item?: ContactInfo) => {
    if (item) {
      setEditingItem(item)
      setContactFormData({
        icon: item.icon,
        label: item.label,
        value: item.value,
        link: item.link || "",
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
    } else {
      setEditingItem(null)
      setContactFormData({
        icon: "Phone",
        label: "",
        value: "",
        link: "",
        sort_order: contactItems.length + 1,
        is_active: true,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseContactForm = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const itemData = {
        icon: contactFormData.icon,
        label: contactFormData.label,
        value: contactFormData.value,
        link: contactFormData.link || null,
        sort_order: contactFormData.sort_order,
        is_active: contactFormData.is_active,
      }

      if (editingItem) {
        const { error } = await supabase
          .from('contact_info')
          .update(itemData as ContactInfoUpdate)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('contact_info')
          .insert(itemData as ContactInfoInsert)

        if (error) throw error
      }

      await loadData()
      handleCloseContactForm()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteContact = async (item: ContactInfo) => {
    if (!confirm(`确定要删除这条联系信息吗？\n\n"${item.label}: ${item.value}"`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', item.id)

      if (error) throw error
      await loadData()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const handleToggleActive = async (item: ContactInfo) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({ is_active: !item.is_active })
        .eq('id', item.id)

      if (error) throw error
      await loadData()
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const handleMoveSortOrder = async (item: ContactInfo, direction: 'up' | 'down') => {
    const currentIndex = contactItems.findIndex(t => t.id === item.id)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= contactItems.length) return

    const targetItem = contactItems[targetIndex]

    try {
      const updates = [
        supabase
          .from('contact_info')
          .update({ sort_order: targetItem.sort_order })
          .eq('id', item.id),
        supabase
          .from('contact_info')
          .update({ sort_order: item.sort_order })
          .eq('id', targetItem.id)
      ]

      const results = await Promise.all(updates)
      if (results.some(result => result.error)) {
        throw new Error('排序更新失败')
      }

      await loadData()
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Footer 管理</h1>
        <p className="text-muted-foreground">管理网站底部的品牌介绍和联系信息</p>
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
              <li>• <strong>品牌介绍</strong>：显示在 Footer 左侧第一栏，包含品牌名称和介绍文字</li>
              <li>• <strong>联系信息</strong>：显示在 Footer 右侧，支持电话、邮箱、地址等多种类型</li>
              <li>• 所有更改会立即在前台网站底部显示</li>
              <li>• 使用上下箭头调整联系信息的显示顺序</li>
              <li>• 禁用的联系信息不会在前台显示</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 品牌介绍编辑区 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">品牌介绍</h2>
            <p className="text-sm text-muted-foreground">Footer 左侧显示的品牌信息</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              品牌名称 *
            </label>
            <Input
              name="brand_name"
              value={brandData.brand_name}
              onChange={handleBrandInputChange}
              placeholder="例如: 潮来"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              品牌介绍 *
            </label>
            <Textarea
              name="brand_description"
              value={brandData.brand_description}
              onChange={handleBrandInputChange}
              placeholder="例如: 正宗潮汕牛肉粿粉，传承三代美食工艺..."
              rows={3}
              required
            />
          </div>

          <Button
            onClick={handleSaveBrand}
            disabled={isSavingBrand || !brandData.brand_name || !brandData.brand_description}
          >
            {isSavingBrand ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存品牌介绍
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 联系信息管理区 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">联系信息</h2>
            <p className="text-sm text-muted-foreground">Footer 右侧显示的联系方式</p>
          </div>
          <Button onClick={() => handleOpenContactForm()}>
            <Plus className="w-4 h-4 mr-2" />
            添加联系信息
          </Button>
        </div>

        {/* Contact Items List */}
        <div className="grid gap-4">
          {contactItems.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">还没有联系信息，点击上方按钮添加第一条</p>
            </Card>
          ) : (
            contactItems.map((item, index) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Sort Order Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveSortOrder(item, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="向上移动"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSortOrder(item, 'down')}
                        disabled={index === contactItems.length - 1}
                        className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="向下移动"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-muted-foreground">
                          图标: {item.icon}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          排序: {item.sort_order}
                        </span>
                        {!item.is_active && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            已禁用
                          </span>
                        )}
                      </div>
                      <p className="text-foreground font-medium">{item.label}: {item.value}</p>
                      {item.link && (
                        <p className="text-sm text-muted-foreground mt-1">链接: {item.link}</p>
                      )}
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {item.is_active ? '已启用' : '已禁用'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.is_active ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.is_active ? 'translate-x-6' : 'translate-x-1'
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
                      onClick={() => handleOpenContactForm(item)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContact(item)}
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
      </div>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingItem ? '编辑联系信息' : '添加联系信息'}
              </h2>
              <button
                onClick={handleCloseContactForm}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  图标类型 *
                </label>
                <select
                  name="icon"
                  value={contactFormData.icon}
                  onChange={handleContactInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  required
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  显示标签 *
                </label>
                <Input
                  name="label"
                  value={contactFormData.label}
                  onChange={handleContactInputChange}
                  placeholder="例如: 联系电话、邮箱地址"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  内容 *
                </label>
                <Input
                  name="value"
                  value={contactFormData.value}
                  onChange={handleContactInputChange}
                  placeholder="例如: 400-1234-5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  链接（可选）
                </label>
                <Input
                  name="link"
                  value={contactFormData.link}
                  onChange={handleContactInputChange}
                  placeholder="例如: tel:400-1234-5678 或 mailto:service@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  电话用 tel:，邮箱用 mailto:，网址用完整 URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">排序顺序</label>
                <Input
                  type="number"
                  name="sort_order"
                  value={contactFormData.sort_order}
                  onChange={handleContactInputChange}
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
                  checked={contactFormData.is_active}
                  onChange={handleContactInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">启用此联系信息</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseContactForm}
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
