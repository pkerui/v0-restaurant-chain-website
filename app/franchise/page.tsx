"use client"

import type React from "react"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, TrendingUp, Award } from "lucide-react"
import { useState } from "react"

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("加盟申请提交:", formData)
    alert("申请已提交，我们将尽快联系您！")
    setFormData({ name: "", phone: "", email: "", city: "", message: "" })
  }

  const benefits = [
    {
      icon: Award,
      title: "品牌力量",
      description: "拥有多年口碑积累的潮汕美食品牌，知名度高",
    },
    {
      icon: TrendingUp,
      title: "盈利模式",
      description: "成熟的商业模式，快速实现投资回报",
    },
    {
      icon: Users,
      title: "团队支持",
      description: "完善的培训体系和全程运营指导",
    },
    {
      icon: CheckCircle2,
      title: "供应保障",
      description: "统一的食材采购和质量标准控制",
    },
  ]

  const requirements = [
    "热爱美食行业，具有餐饮业经营经验优先",
    "有一定的资金实力和风险承受能力",
    "认同潮来品牌文化和经营理念",
    "具有良好的商业信誉和社会声誉",
    "能够按照总部要求执行经营方案",
    "承诺投入足够的时间和精力",
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">加盟潮来</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            加入我们的行列，成为潮来的合作伙伴，共同开创美食事业新局面
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Benefits Section */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">加盟优势</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              选择潮来，选择与一个有实力、有未来的美食品牌合作
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="mb-16 md:mb-24 bg-secondary/10 rounded-lg p-8 md:p-12 border border-border">
            <h2 className="text-3xl font-bold mb-2 text-center">加盟条件</h2>
            <p className="text-center text-muted-foreground mb-8">我们期待与以下条件的合作伙伴携手合作：</p>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-12 text-center">加盟流程</h2>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { step: "1", title: "提交申请", desc: "填写申请表格" },
                { step: "2", title: "资格审核", desc: "我们审核评估" },
                { step: "3", title: "深入洽谈", desc: "了解详细方案" },
                { step: "4", title: "正式合作", desc: "签订合同开业" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">立即申请</h2>
            <p className="text-center text-muted-foreground mb-8">填写下方表格，我们将在24小时内与您联系</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">姓名 *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">电话 *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入您的电话"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">邮箱 *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入您的邮箱"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">所在城市 *</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="请输入所在城市"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">申请留言</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="请告诉我们更多关于您的信息（可选）"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                提交申请
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              提交申请即表示您同意我们的隐私政策和服务条款
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
