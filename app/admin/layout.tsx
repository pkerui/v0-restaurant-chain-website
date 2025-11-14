"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Store,
  UtensilsCrossed,
  Settings,
  MessageSquare,
  Images,
  LogOut,
  Menu,
  X,
  Star,
  ListOrdered,
  Contact,
  Briefcase
} from "lucide-react"
import { supabase, isAdmin, getCurrentUserProfile } from "@/lib/supabase/client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pendingFranchise, setPendingFranchise] = useState(0)
  const [unreadContacts, setUnreadContacts] = useState(0)

  // 检查认证状态
  useEffect(() => {
    checkAuth()

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/admin/login')
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  // 获取未处理消息数量并定期刷新
  useEffect(() => {
    if (!isLoading && userProfile) {
      // 定义获取未读数量的函数
      const fetchUnreadCounts = async () => {
        try {
          // 获取待处理加盟申请数量
          const { count: franchiseCount } = await supabase
            .from('franchise_applications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

          // 获取未读联系表单数量
          const { count: contactsCount } = await supabase
            .from('contact_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'unread')

          setPendingFranchise(franchiseCount || 0)
          setUnreadContacts(contactsCount || 0)
        } catch (error) {
          console.error('获取未读数量失败:', error)
        }
      }

      // 立即获取一次
      fetchUnreadCounts()

      // 每30秒刷新一次
      const interval = setInterval(fetchUnreadCounts, 30000)

      // 监听自定义事件，立即刷新
      const handleRefresh = () => {
        console.log('收到刷新事件，立即更新徽章数量')
        fetchUnreadCounts()
      }
      window.addEventListener('refreshUnreadCounts', handleRefresh)

      return () => {
        clearInterval(interval)
        window.removeEventListener('refreshUnreadCounts', handleRefresh)
      }
    }
  }, [isLoading, userProfile])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      const admin = await isAdmin()
      if (!admin) {
        router.push('/admin/login')
        return
      }

      const profile = await getCurrentUserProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // 导航菜单
  const navItems = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: '控制台',
    },
    {
      href: '/admin/franchise',
      icon: FileText,
      label: '加盟申请',
    },
    {
      href: '/admin/franchise-content',
      icon: Briefcase,
      label: '加盟信息管理',
    },
    {
      href: '/admin/stores',
      icon: Store,
      label: '门店管理',
    },
    {
      href: '/admin/menu',
      icon: UtensilsCrossed,
      label: '菜单管理',
    },
    {
      href: '/admin/menu-categories',
      icon: ListOrdered,
      label: '菜单分类',
    },
    {
      href: '/admin/brand-gallery',
      icon: Images,
      label: '品牌风采',
    },
    {
      href: '/admin/testimonials',
      icon: Star,
      label: '顾客评价',
    },
    {
      href: '/admin/contacts',
      icon: MessageSquare,
      label: '联系表单',
    },
    {
      href: '/admin/footer',
      icon: Contact,
      label: 'Footer 管理',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: '站点设置',
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // 登录页面不使用布局
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-background"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">潮来管理后台</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            // 获取当前菜单项的未读数量
            let badgeCount = 0
            if (item.href === '/admin/franchise') {
              badgeCount = pendingFranchise
            } else if (item.href === '/admin/contacts') {
              badgeCount = unreadContacts
            }

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {badgeCount > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </button>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-foreground">
              {userProfile?.full_name || '管理员'}
            </p>
            <p className="text-xs text-muted-foreground">管理员账户</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6">
          <h2 className="text-lg font-semibold text-foreground">
            {navItems.find(item => item.href === pathname)?.label || '管理后台'}
          </h2>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
