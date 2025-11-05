"use client"

import type React from "react"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
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
    console.log("联系表单提交:", formData)
    alert("感谢您的留言，我们将尽快回复！")
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "电话",
      content: "400-XXXX-XXXX",
      link: "tel:400-XXXX-XXXX",
    },
    {
      icon: Mail,
      title: "邮箱",
      content: "service@chaolai.com",
      link: "mailto:service@chaolai.com",
    },
    {
      icon: MapPin,
      title: "地址",
      content: "广东省汕头市中山路123号",
      link: "#",
    },
    {
      icon: Clock,
      title: "营业时间",
      content: "周一至周日 10:00-22:00",
      link: "#",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">联系我们</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">有任何问题或建议？我们随时准备为您服务</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <a href={item.link} className="text-sm text-primary hover:underline break-all">
                    {item.content}
                  </a>
                </Card>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">发送消息</h2>
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
                  <label className="block text-sm font-medium mb-2">主题 *</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="请输入主题"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">留言内容 *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="请输入您的留言..."
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                发送消息
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
