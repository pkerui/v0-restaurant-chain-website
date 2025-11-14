"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, LucideIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { ContactInfo, FooterConfig } from "@/lib/supabase/types"

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  MessageCircle,
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [contactInfoList, setContactInfoList] = useState<ContactInfo[]>([])
  const [brandName, setBrandName] = useState('潮来')
  const [brandDescription, setBrandDescription] = useState('正宗潮汕牛肉粿粉，传承三代美食工艺。我们用心为每位顾客奉献地道的潮汕美食。')

  useEffect(() => {
    loadContactInfo()
    loadFooterSettings()
  }, [])

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

  const loadFooterSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_config')
        .select('*')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setBrandName(data.brand_name)
        setBrandDescription(data.brand_description)
      }
    } catch (error) {
      console.error('加载 Footer 设置失败:', error)
      // 使用默认值（已在 useState 中设置）
    }
  }

  const renderContactItem = (item: ContactInfo) => {
    const IconComponent = iconMap[item.icon] || Phone
    const content = (
      <>
        <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{item.value}</span>
      </>
    )

    if (item.link) {
      return (
        <li key={item.id} className="flex items-start gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <a href={item.link} className="flex items-start gap-2">
            {content}
          </a>
        </li>
      )
    }

    return (
      <li key={item.id} className="flex items-start gap-2 opacity-80">
        {content}
      </li>
    )
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                <span className="text-foreground font-bold">{brandName.charAt(0)}</span>
              </div>
              {brandName}
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              {brandDescription}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "关于我们" },
                { href: "/menu", label: "菜单" },
                { href: "/stores", label: "门店位置" },
                { href: "/franchise", label: "加盟合作" },
                { href: "/contact", label: "联系我们" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-80 hover:opacity-100 transition-opacity">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-semibold mb-4">联系方式</h4>
            <ul className="space-y-3 text-sm">
              {contactInfoList.map(renderContactItem)}
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-background/20 pt-8">
          <p className="text-sm opacity-60 text-center">&copy; {currentYear} 潮来美食连锁. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
}
