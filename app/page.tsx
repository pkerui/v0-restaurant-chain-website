"use client"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Testimonials from "@/components/testimonials"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: "🍲",
      title: "地道食材",
      description: "精选汕头当地牛肉，每日新鲜采购，保证品质",
    },
    {
      icon: "👨‍🍳",
      title: "传统手艺",
      description: "传承三代的烹饪工艺，每一碗都是用心之作",
    },
    {
      icon: "⭐",
      title: "顾客满意",
      description: "连年获得好评，成为顾客的美食首选",
    },
  ]

  const homeTestimonials = [
    {
      id: 1,
      name: "王先生",
      role: "常客",
      content: "潮来的牛肉粿粉真的绝了！牛肉鲜嫩，粿粉软滑，每次来都要吃。五年的忠实粉丝！",
      rating: 5,
      avatar: "王",
    },
    {
      id: 2,
      name: "李女士",
      role: "美食爱好者",
      content: "在潮来吃了一次就爱上了，地道的潮汕味道，价格也很公道。推荐给所有朋友！",
      rating: 5,
      avatar: "李",
    },
    {
      id: 3,
      name: "张先生",
      role: "上班族",
      content: "工作太忙经常点外卖，潮来的快手粿粉让我节省了很多时间，味道还特别好。",
      rating: 5,
      avatar: "张",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-gradient-to-b from-secondary to-background overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 0, transparent 50%)`,
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">潮来</h1>
          <p className="text-xl md:text-2xl text-foreground mb-3 font-semibold">正宗潮汕牛肉粿粉</p>
          <p className="text-base md:text-lg text-muted-foreground mb-10 text-balance">三代美食传承 · 诚邀加盟合伙人</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link href="/stores">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                查看门店位置
              </Button>
            </Link>
            <Link href="/franchise">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-secondary px-8 bg-transparent"
              >
                加盟信息
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-balance">为什么选择潮来</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            我们坚持传统工艺与现代经营相结合，为顾客提供最地道的潮汕美食体验
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Stores Card */}
            <Link href="/stores" className="group">
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-primary transition-all h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                  我们的门店
                  <ChevronRight className="w-6 h-6" />
                </h3>
                <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                  探索我们在全市的三家直营店，找到离你最近的潮来
                </p>
                <div className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform inline-block">
                  浏览门店 →
                </div>
              </div>
            </Link>

            {/* Franchise Card */}
            <Link href="/franchise" className="group">
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg hover:border-accent transition-all h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                  加盟合作
                  <ChevronRight className="w-6 h-6" />
                </h3>
                <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                  加入潮来大家庭，共同打造美食品牌，实现创业梦想
                </p>
                <div className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform inline-block">
                  了解详情 →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={homeTestimonials} title="顾客怎么说" showLimit={3} />

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">3</div>
              <p className="text-muted-foreground">家直营店</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">10K+</div>
              <p className="text-muted-foreground">日均服务顾客</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">顾客满意度</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
