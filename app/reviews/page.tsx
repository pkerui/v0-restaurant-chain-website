"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Testimonials from "@/components/testimonials"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  const testimonials = [
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
    {
      id: 4,
      name: "陈女士",
      role: "家庭主妇",
      content: "带孩子来吃了几次，小朋友特别喜欢。卫生干净，食材新鲜，很放心。",
      rating: 4,
      avatar: "陈",
    },
    {
      id: 5,
      name: "黄先生",
      role: "美食评论员",
      content: "作为美食评论员，我尝试过很多家粿粉店。潮来的手艺绝对是顶级的，传统工艺和现代管理的完美结合。",
      rating: 5,
      avatar: "黄",
    },
    {
      id: 6,
      name: "林女士",
      role: "旅客",
      content: "来汕头出差，同事推荐来潮来。真没让我失望，这就是我要找的地道潮汕美食！",
      rating: 5,
      avatar: "林",
    },
    {
      id: 7,
      name: "周先生",
      role: "美食博主",
      content: "为潮来代言！每次有新粉丝来汕头，我都会带他们来潮来品尝正宗潮汕牛肉粿粉。",
      rating: 5,
      avatar: "周",
    },
    {
      id: 8,
      name: "吴女士",
      role: "老顾客",
      content: "从潮来开业就开始来了，十年的支持者。食材、味道、服务都一直保持着高水准。",
      rating: 5,
      avatar: "吴",
    },
  ]

  const stats = [
    { label: "总评价数", value: "2,847", unit: "条" },
    { label: "平均评分", value: "4.8", unit: "分" },
    { label: "满意度", value: "98%", unit: "" },
    { label: "回头客比例", value: "94%", unit: "" },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">顾客评价</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">听听我们的顾客怎么说，每一条评价都是对潮来最大的鼓励</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-secondary/20 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                  <span className="text-lg text-muted-foreground">{stat.unit}</span>
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">评分分布</h2>
          <div className="grid md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[5, 4, 3, 2, 1].map((stars) => (
              <Card key={stars} className="p-6 text-center border border-border">
                <div className="flex gap-1 justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < stars ? "fill-accent text-accent" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <div className="bg-muted rounded-full h-2 mb-2 overflow-hidden">
                  <div className="bg-accent h-full" style={{ width: `${[80, 15, 3, 1, 1][5 - stars]}%` }} />
                </div>
                <p className="text-sm font-semibold text-foreground">{[80, 15, 3, 1, 1][5 - stars]}%</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <Testimonials testimonials={testimonials} title="所有顾客评价" />

      {/* Dianping CTA */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-secondary/20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">想看更多真实评价？</h2>
          <p className="text-lg text-muted-foreground mb-8">
            访问大众点评，查看数千条来自真实顾客的评价和门店照片
          </p>
          <a
            href="https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
              <span>前往大众点评</span>
              <span>→</span>
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
