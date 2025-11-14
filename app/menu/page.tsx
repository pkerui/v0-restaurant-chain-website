"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import type { MenuItem, SiteSetting } from "@/lib/supabase/types"

type MenuCategory = {
  id: string
  name: string
  sort_order: number
  is_active: boolean
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuTips, setMenuTips] = useState<string[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({
    menu_page_title: "潮来菜单",
    menu_page_description: "传统潮汕美食，每一道都是用心烹饪的经典之作",
    menu_tips_title: "用餐小贴士"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load menu categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Load menu items
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true })

      if (menuError) throw menuError
      setMenuItems(menuData || [])

      // Load settings (including menu tips)
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('page', 'menu')

      if (settingsError) throw settingsError

      // Convert array to key-value object and extract tips
      if (settingsData) {
        const settingsObj: Record<string, string> = {}
        const tipsArray: string[] = []

        settingsData.forEach((setting: SiteSetting) => {
          settingsObj[setting.key] = setting.value

          // Extract menu tips (keys like menu_tips_1, menu_tips_2, etc.)
          // Only include non-empty tips
          if (setting.key.startsWith('menu_tips_') &&
              setting.key !== 'menu_tips_title' &&
              setting.value.trim() !== '') {
            tipsArray.push(setting.value)
          }
        })

        setSettings(prev => ({ ...prev, ...settingsObj }))
        setMenuTips(tipsArray)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  // Create category options with "All" as first option
  const categoryOptions = [
    { id: "all", name: "all", label: "全部菜品" },
    ...categories.map(cat => ({ id: cat.id, name: cat.name, label: cat.name }))
  ]

  const SpicyLevel = ({ level }: { level: number }) => {
    return (
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < level ? "text-red-500 text-lg" : "text-muted-foreground text-lg"}>
            🌶️
          </span>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-secondary to-secondary/80 text-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{settings.menu_page_title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{settings.menu_page_description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">加载中...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无菜品信息</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border border-border hover:border-primary/30"
                >
                  {/* Item Image */}
                  {item.image_url ? (
                    <div className="w-full aspect-[4/3] overflow-hidden bg-secondary">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-secondary to-primary/10 flex items-center justify-center">
                      <span className="text-6xl opacity-50">🍜</span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground flex-1">{item.name}</h3>
                      {item.is_bestseller && <Badge className="bg-accent text-accent-foreground text-xs">热销</Badge>}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                    {/* Footer */}
                    <div className="flex items-end justify-between pt-4 border-t border-border">
                      <div className="space-y-2">
                        <SpicyLevel level={item.spicy_level} />
                        <p className="text-2xl font-bold text-primary">¥{item.price}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Tips Section */}
          {menuTips.length > 0 && (
            <div className="mt-16 bg-secondary/20 rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold mb-4">{settings.menu_tips_title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {menuTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Online Order CTA */}
          <div className="mt-12 bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 text-center text-accent-foreground">
            <h3 className="text-2xl font-bold mb-3">想品尝美味？</h3>
            <p className="text-lg mb-6 opacity-90">通过大众点评在线订餐，享受便捷送餐服务</p>
            <a
              href="https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition-colors inline-flex items-center gap-2">
                <span>去大众点评订餐</span>
                <span>→</span>
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
