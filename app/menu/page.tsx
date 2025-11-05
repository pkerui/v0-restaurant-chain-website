"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const menuItems = [
    // 主食类
    {
      id: 1,
      name: "潮汕牛肉粿粉",
      category: "main",
      price: 18,
      description: "精选汕头牛肉，传统手工制作牛肉粿粉，口感鲜香",
      spicy: 2,
      bestseller: true,
    },
    {
      id: 2,
      name: "潮汕牛肉丸粉",
      category: "main",
      price: 16,
      description: "手工牛肉丸配软滑牛肉粿粉，每一口都是美味",
      spicy: 1,
      bestseller: true,
    },
    {
      id: 3,
      name: "牛肉汤粉",
      category: "main",
      price: 15,
      description: "用8小时熬制的浓汤，牛肉鲜嫩，汤色金黄",
      spicy: 0,
      bestseller: false,
    },
    {
      id: 4,
      name: "混合肉粿粉",
      category: "main",
      price: 20,
      description: "牛肉、牛肉丸、牛筋的完美组合，让您品尝多种口感",
      spicy: 1,
      bestseller: false,
    },
    // 配菜类
    {
      id: 5,
      name: "潮汕鹅肉饭",
      category: "side",
      price: 22,
      description: "卤水鹅肉鲜香，配秘制酱汁，香气十足",
      spicy: 1,
      bestseller: true,
    },
    {
      id: 6,
      name: "冬菜牛肉饼",
      category: "side",
      price: 12,
      description: "酥脆饼皮，馅料饱满，冬菜香气扑鼻",
      spicy: 0,
      bestseller: false,
    },
    {
      id: 7,
      name: "豆类蔬菜",
      category: "side",
      price: 8,
      description: "时令蔬菜，清爽健康，搭配粿粉更佳",
      spicy: 0,
      bestseller: false,
    },
    // 饮品类
    {
      id: 8,
      name: "潮汕凤凰单丛茶",
      category: "drink",
      price: 6,
      description: "精选单丛茶叶，香气悠长，回甘不断",
      spicy: 0,
      bestseller: true,
    },
    {
      id: 9,
      name: "普洱老茶",
      category: "drink",
      price: 8,
      description: "陈年普洱，滋味醇厚，茶香氤氲",
      spicy: 0,
      bestseller: false,
    },
    {
      id: 10,
      name: "鲜果榨汁",
      category: "drink",
      price: 10,
      description: "新鲜水果现榨，营养健康，清凉爽口",
      spicy: 0,
      bestseller: false,
    },
  ]

  const categories = [
    { id: "all", label: "全部菜品" },
    { id: "main", label: "主食" },
    { id: "side", label: "配菜" },
    { id: "drink", label: "饮品" },
  ]

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const SpicyLevel = ({ level }: { level: number }) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">潮来菜单</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">传统潮汕美食，每一道都是用心烹饪的经典之作</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="p-6 hover:shadow-lg transition-shadow border border-border hover:border-primary/30"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground flex-1">{item.name}</h3>
                  {item.bestseller && <Badge className="bg-accent text-accent-foreground text-xs">热销</Badge>}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                {/* Footer */}
                <div className="flex items-end justify-between pt-4 border-t border-border">
                  <div className="space-y-2">
                    <SpicyLevel level={item.spicy} />
                    <p className="text-2xl font-bold text-primary">¥{item.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-16 bg-secondary/20 rounded-lg p-8 border border-border">
            <h3 className="text-xl font-bold mb-4">用餐小贴士</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 我们的所有菜品均采用新鲜食材，每日采购</li>
              <li>• 可根据个人口味调整辣度，请在点餐时告知</li>
              <li>• 支持团体聚餐预订，欢迎来电咨询</li>
              <li>• 菜单价格仅供参考，具体以门店为准</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
