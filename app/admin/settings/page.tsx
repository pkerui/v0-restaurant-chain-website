"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Search } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface SiteSetting {
  id: string
  key: string
  value: string
  description: string | null
  page: string
  created_at: string
  updated_at: string
}

export default function SettingsManagementPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [filterPage, setFilterPage] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('page', { ascending: true })
        .order('key', { ascending: true })

      if (error) throw error
      setSettings(data || [])

      // Initialize edited values
      const initial: Record<string, string> = {}
      data?.forEach(setting => {
        initial[setting.id] = setting.value
      })
      setEditedValues(initial)
    } catch (error) {
      console.error('加载设置失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pages = [
    { id: "all", label: "全部" },
    { id: "home", label: "首页" },
    { id: "stores", label: "门店" },
    { id: "menu", label: "菜单" },
    { id: "franchise", label: "加盟" },
    { id: "about", label: "关于" },
    { id: "contact", label: "联系" },
  ]

  // 各页面的子分类
  const pageCategories: Record<string, Array<{ id: string; label: string; prefix: string }>> = {
    home: [
      { id: "all", label: "全部", prefix: "" },
      { id: "hero", label: "Hero 区域", prefix: "home_hero_" },
      { id: "why", label: "为什么选择", prefix: "home_why_" },
      { id: "feature", label: "特色介绍", prefix: "home_feature_" },
    ],
    about: [
      { id: "all", label: "全部", prefix: "" },
      { id: "page", label: "页面信息", prefix: "about_page_" },
      { id: "story", label: "我们的故事", prefix: "about_story_" },
      { id: "value", label: "核心价值观", prefix: "about_value_" },
      { id: "milestone", label: "发展历程", prefix: "about_milestone_" },
      { id: "team", label: "我们的团队", prefix: "about_team_" },
      { id: "achievement", label: "我们的成就", prefix: "about_achievement_" },
    ],
    franchise: [
      { id: "all", label: "全部", prefix: "" },
      { id: "page", label: "页面信息", prefix: "franchise_page_" },
      { id: "form", label: "申请表单", prefix: "franchise_form_" },
    ],
    menu: [
      { id: "all", label: "全部", prefix: "" },
      { id: "page", label: "页面信息", prefix: "menu_page_" },
      { id: "tips", label: "用餐小贴士", prefix: "menu_tips_" },
    ],
    stores: [
      { id: "all", label: "全部", prefix: "" },
      { id: "page", label: "页面信息", prefix: "stores_page_" },
      { id: "map", label: "地图区域", prefix: "stores_map_" },
    ],
    contact: [
      { id: "all", label: "全部", prefix: "" },
      { id: "page", label: "页面信息", prefix: "contact_page_" },
    ],
  }

  // 根据 key 获取分类
  const getCategoryByKey = (page: string, key: string): string => {
    const categories = pageCategories[page]
    if (!categories) return "all"

    for (const category of categories) {
      if (category.prefix && key.startsWith(category.prefix)) {
        return category.id
      }
    }
    return "all"
  }

  const filteredSettings = settings.filter(setting => {
    const matchesPage = filterPage === "all" || setting.page === filterPage

    // 子分类筛选（适用于所有有分类的页面）
    const hasCategories = filterPage !== "all" && pageCategories[filterPage]
    const matchesCategory = !hasCategories || filterCategory === "all" ||
      getCategoryByKey(setting.page, setting.key) === filterCategory

    const matchesSearch = searchQuery === "" ||
      setting.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setting.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesPage && matchesCategory && matchesSearch
  })

  const handleValueChange = (id: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const hasChanges = (setting: SiteSetting) => {
    return editedValues[setting.id] !== setting.value
  }

  const handleSave = async (setting: SiteSetting) => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: editedValues[setting.id] })
        .eq('id', setting.id)

      if (error) throw error

      // Update local state
      setSettings(prev => prev.map(s =>
        s.id === setting.id
          ? { ...s, value: editedValues[setting.id] }
          : s
      ))

      alert('保存成功！')
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      const updates = settings
        .filter(setting => hasChanges(setting))
        .map(setting => ({
          id: setting.id,
          value: editedValues[setting.id]
        }))

      if (updates.length === 0) {
        alert('没有需要保存的更改')
        return
      }

      // Update all changed settings
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: update.value })
          .eq('id', update.id)

        if (error) throw error
      }

      // Reload settings
      await loadSettings()
      alert(`成功保存 ${updates.length} 项更改！`)
    } catch (error: any) {
      console.error('批量保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const getPageLabel = (pageId: string) => {
    return pages.find(p => p.id === pageId)?.label || pageId
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
          <h1 className="text-2xl font-bold text-foreground">站点设置</h1>
          <p className="text-muted-foreground">管理网站各页面的文本内容</p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={isSaving || !settings.some(s => hasChanges(s))}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              保存全部更改
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Page Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setFilterPage(page.id)
                  setFilterCategory("all") // 切换页面时重置子分类
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterPage === page.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索设置项..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter - 显示当前页面的分类 */}
        {filterPage !== "all" && pageCategories[filterPage] && (
          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm text-muted-foreground mb-2">内容分类：</p>
            <div className="flex gap-2 flex-wrap">
              {pageCategories[filterPage].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterCategory === category.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        {filteredSettings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">未找到匹配的设置项</p>
          </Card>
        ) : (
          filteredSettings.map((setting) => (
            <Card key={setting.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{setting.key}</h3>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                        {getPageLabel(setting.page)}
                      </span>
                    </div>
                    {setting.description && (
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    )}
                  </div>
                </div>

                {/* Value Editor */}
                <div className="space-y-2">
                  {setting.value.length > 100 ? (
                    <Textarea
                      value={editedValues[setting.id] || ""}
                      onChange={(e) => handleValueChange(setting.id, e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      type="text"
                      value={editedValues[setting.id] || ""}
                      onChange={(e) => handleValueChange(setting.id, e.target.value)}
                      className="w-full"
                    />
                  )}
                </div>

                {/* Save Button */}
                {hasChanges(setting) && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleSave(setting)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          保存此项
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card className="p-4 bg-secondary/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            显示 {filteredSettings.length} / {settings.length} 项设置
          </span>
          <span className="text-muted-foreground">
            未保存更改: {settings.filter(s => hasChanges(s)).length} 项
          </span>
        </div>
      </Card>
    </div>
  )
}
