"use client"

import type React from "react"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, TrendingUp, Award, Loader2, Star, Target, Zap, Shield, LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { FranchiseBenefit, FranchiseRequirement, FranchiseProcess } from "@/lib/supabase/types"

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Target,
  Zap,
  Shield,
}

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // 动态加载的内容
  const [benefits, setBenefits] = useState<FranchiseBenefit[]>([])
  const [requirements, setRequirements] = useState<FranchiseRequirement[]>([])
  const [processes, setProcesses] = useState<FranchiseProcess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<Record<string, string>>({
    franchise_page_title: "加盟潮来",
    franchise_page_description: "加入我们的行列，成为潮来的合作伙伴，共同开创美食事业新局面",
    franchise_form_title: "立即申请",
    franchise_form_description: "填写下方表格，我们将在24小时内与您联系"
  })

  useEffect(() => {
    loadContent()
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('page', 'franchise')

      if (error) throw error

      if (data) {
        const settingsObj: Record<string, string> = {}
        data.forEach((setting: any) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings(prev => ({ ...prev, ...settingsObj }))
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  const loadContent = async () => {
    try {
      const [benefitsData, requirementsData, processesData] = await Promise.all([
        supabase.from('franchise_benefits').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('franchise_requirements').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('franchise_process').select('*').eq('is_active', true).order('sort_order'),
      ])

      setBenefits(benefitsData.data || [])
      setRequirements(requirementsData.data || [])
      setProcesses(processesData.data || [])
    } catch (error) {
      console.error('加载加盟内容失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // 清除之前的状态消息
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // 验证手机号格式（必须是11位数字）
    if (!/^[0-9]{11}$/.test(formData.phone)) {
      setSubmitStatus({
        type: 'error',
        message: '请输入有效的11位手机号码'
      })
      setIsSubmitting(false)
      return
    }

    try {
      // 检查 24 小时内是否有相同邮箱的申请
      const { data: recentCheck } = await supabase
        .rpc('check_recent_application', { p_email: formData.email })

      if (recentCheck) {
        setSubmitStatus({
          type: 'error',
          message: '您在 24 小时内已提交过申请，请耐心等待我们的联系。'
        })
        setIsSubmitting(false)
        return
      }

      // 提交申请
      const { error } = await supabase
        .from('franchise_applications')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          message: formData.message || null,
        })

      if (error) {
        throw error
      }

      // 成功
      setSubmitStatus({
        type: 'success',
        message: '申请已成功提交！我们将在 24 小时内联系您。'
      })
      setFormData({ name: "", phone: "", email: "", city: "", message: "" })
    } catch (error) {
      console.error('提交错误:', error)
      setSubmitStatus({
        type: 'error',
        message: '提交失败，请稍后重试或直接致电联系我们。'
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{settings.franchise_page_title}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {settings.franchise_page_description}
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

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : benefits.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">暂无加盟优势信息</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {benefits.map((benefit) => {
                  const Icon = iconMap[benefit.icon] || Award
                  return (
                    <Card key={benefit.id} className="p-6 hover:shadow-lg transition-shadow w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] max-w-[280px]">
                      <Icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Requirements Section */}
          <div className="mb-16 md:mb-24 bg-secondary/10 rounded-lg p-8 md:p-12 border border-border">
            <h2 className="text-3xl font-bold mb-2 text-center">加盟条件</h2>
            <p className="text-center text-muted-foreground mb-8">我们期待与以下条件的合作伙伴携手合作：</p>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : requirements.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">暂无加盟条件信息</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {requirements.map((req) => (
                  <div key={req.id} className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{req.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Process Section */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-12 text-center">加盟流程</h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : processes.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">暂无加盟流程信息</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {processes.map((item) => (
                  <div key={item.id} className="text-center w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.125rem)] min-w-[200px] max-w-[240px]">
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                      {item.step_number}
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">{settings.franchise_form_title}</h2>
            <p className="text-center text-muted-foreground mb-8">{settings.franchise_form_description}</p>

            {/* Status Message */}
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

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
                    placeholder="请输入11位手机号码"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    minLength={11}
                    title="请输入11位数字手机号码"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">请输入11位手机号码</p>
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
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '提交申请'
                )}
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
