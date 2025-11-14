"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, Loader2, LucideIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { ContactInfo, SiteSetting } from "@/lib/supabase/types"

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageCircle,
}

const formSchema = z.object({
  name: z.string().min(1, "姓名不能为空").max(50, "姓名不能超过50个字符"),
  email: z.string().min(1, "邮箱不能为空").email("请输入正确的邮箱格式，例如: example@email.com"),
  phone: z.string()
    .min(1, "电话不能为空")
    .regex(/^1[3-9]\d{9}$/, "请输入11位有效的手机号码"),
  message: z.string().min(1, "留言内容不能为空").max(500, "留言内容不能超过500个字符"),
})

type FormData = z.infer<typeof formSchema>

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [contactInfoList, setContactInfoList] = useState<ContactInfo[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_page_title: "联系我们",
    contact_page_description: "我们期待听到您的声音"
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    loadContactInfo()
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('page', 'contact')

      if (error) throw error

      if (data) {
        const settingsObj: Record<string, string> = {}
        data.forEach((setting: SiteSetting) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings(prev => ({ ...prev, ...settingsObj }))
      }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  const loadContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setContactInfoList(data || [])
    } catch (error) {
      console.error('加载联系信息失败:', error)
      // 使用默认数据作为后备
      setContactInfoList([
        {
          id: '1',
          icon: 'Phone',
          label: '联系电话',
          value: '400-XXXX-XXXX',
          link: 'tel:400-xxxx-xxxx',
          sort_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          icon: 'Mail',
          label: '邮箱地址',
          value: 'service@chaolai.com',
          link: 'mailto:service@chaolai.com',
          sort_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          icon: 'MapPin',
          label: '公司地址',
          value: '广东省汕头市',
          link: null,
          sort_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '4',
          icon: 'Clock',
          label: '营业时间',
          value: '10:00-22:00',
          link: null,
          sort_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }
  }

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading")
    setErrorMsg("")

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          status: 'unread'
        }])

      if (error) throw error

      setSubmitStatus("success")
      reset()

      // 3秒后重置状态
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 3000)
    } catch (error: any) {
      console.error('提交失败:', error)
      setErrorMsg(error.message || "提交失败，请稍后重试")
      setSubmitStatus("error")
    }
  }


  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{settings.contact_page_title}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">{settings.contact_page_description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfoList.map((item) => {
              const Icon = iconMap[item.icon] || Phone
              return (
                <Card key={item.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{item.label}</h3>
                  {item.link ? (
                    <a href={item.link} className="text-sm text-primary hover:underline break-all">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground break-all">{item.value}</p>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">发送消息</h2>
            <p className="text-center text-muted-foreground mb-8">填写下方表格，我们将在24小时内与您联系</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">姓名 *</label>
                  <Input
                    {...register("name")}
                    placeholder="请输入您的姓名"
                    maxLength={50}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">手机号码 *</label>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="请输入11位手机号码"
                    maxLength={11}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">邮箱地址 *</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  留言内容 *
                  <span className="text-xs text-muted-foreground ml-2">（最多500字）</span>
                </label>
                <Textarea
                  {...register("message")}
                  placeholder="请输入您的留言..."
                  rows={5}
                  maxLength={500}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitStatus === "loading"}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {submitStatus === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    发送中...
                  </>
                ) : (
                  "发送消息"
                )}
              </Button>
            </form>

            {submitStatus === "success" && (
              <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  ✅ 消息发送成功！我们会尽快回复您。
                </AlertDescription>
              </Alert>
            )}
            {submitStatus === "error" && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
