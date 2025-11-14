"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { FileText, Store, UtensilsCrossed, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingApplications: 0,
    totalApplications: 0,
    totalStores: 0,
    totalMenuItems: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentApplications, setRecentApplications] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // 获取统计数据
      const [applicationsResult, storesResult, menuResult] = await Promise.all([
        supabase.from('franchise_applications').select('id, status', { count: 'exact' }),
        supabase.from('stores').select('id', { count: 'exact' }),
        supabase.from('menu_items').select('id', { count: 'exact' }),
      ])

      // 获取最近的申请
      const { data: recent } = await supabase
        .from('franchise_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      const pendingCount = applicationsResult.data?.filter(
        (app: any) => app.status === 'pending'
      ).length || 0

      setStats({
        pendingApplications: pendingCount,
        totalApplications: applicationsResult.count || 0,
        totalStores: storesResult.count || 0,
        totalMenuItems: menuResult.count || 0,
      })

      setRecentApplications(recent || [])
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: '待处理申请',
      value: stats.pendingApplications,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      link: '/admin/franchise',
    },
    {
      title: '总申请数',
      value: stats.totalApplications,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      link: '/admin/franchise',
    },
    {
      title: '门店数量',
      value: stats.totalStores,
      icon: Store,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      link: '/admin/stores',
    },
    {
      title: '菜品数量',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      link: '/admin/menu',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-800' },
      contacted: { label: '已联系', className: 'bg-blue-100 text-blue-800' },
      rejected: { label: '已拒绝', className: 'bg-red-100 text-red-800' },
      partnered: { label: '已合作', className: 'bg-green-100 text-green-800' },
    }
    const config = statusMap[status] || statusMap.pending
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">欢迎回来！</h1>
        <p className="text-muted-foreground">这是您的管理控制台概览</p>
      </div>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">最近的加盟申请</h2>
          <Link href="/admin/franchise">
            <button className="text-sm text-primary hover:underline">
              查看全部 →
            </button>
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">暂无申请</p>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{app.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.phone} · {app.city}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString('zh-CN')}
                  </p>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">快捷操作</h3>
          <div className="space-y-2">
            <Link href="/admin/franchise">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition-colors text-sm">
                处理加盟申请
              </button>
            </Link>
            <Link href="/admin/stores">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition-colors text-sm">
                管理门店信息
              </button>
            </Link>
            <Link href="/admin/menu">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition-colors text-sm">
                更新菜单内容
              </button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">系统提示</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            {stats.pendingApplications > 0 && (
              <p>• 您有 {stats.pendingApplications} 个待处理的加盟申请</p>
            )}
            <p>• 定期更新门店信息可以提升用户体验</p>
            <p>• 确保大众点评链接准确有效</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
