"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Download, Eye, Loader2, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { FranchiseApplication } from "@/lib/supabase/types"

export default function FranchiseManagementPage() {
  const [applications, setApplications] = useState<FranchiseApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<FranchiseApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<FranchiseApplication | null>(null)
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, statusFilter])

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('franchise_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error('加载申请失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.phone.includes(searchQuery) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('franchise_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // 更新本地状态
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus as any } : app
        )
      )

      // 如果详情页面打开，也更新
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus as any })
      }

      // 触发自定义事件通知父组件刷新未读数量
      console.log('加盟申请状态已更新，触发刷新事件')
      window.dispatchEvent(new CustomEvent('refreshUnreadCounts'))
    } catch (error) {
      console.error('更新状态失败:', error)
      alert('更新状态失败，请重试')
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedApp) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('franchise_applications')
        .update({ notes })
        .eq('id', selectedApp.id)

      if (error) throw error

      // 更新本地状态
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id ? { ...app, notes } : app
        )
      )

      setSelectedApp(null)
      setNotes("")
      alert('备注保存成功！')
    } catch (error: any) {
      console.error('保存备注失败:', error)
      alert('保存备注失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['姓名', '电话', '邮箱', '城市', '留言', '状态', '备注', '提交时间']
    const rows = filteredApplications.map((app) => [
      app.name,
      app.phone,
      app.email,
      app.city,
      app.message || '',
      getStatusLabel(app.status),
      app.notes || '',
      new Date(app.created_at).toLocaleString('zh-CN'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `加盟申请_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待处理',
      contacted: '已联系',
      rejected: '已拒绝',
      partnered: '已合作',
    }
    return statusMap[status] || status
  }

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
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">加盟申请管理</h1>
          <p className="text-muted-foreground">共 {applications.length} 条申请</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          导出 CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索姓名、电话、邮箱、城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="contacted">已联系</option>
            <option value="rejected">已拒绝</option>
            <option value="partnered">已合作</option>
          </select>
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">没有找到符合条件的申请</p>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{app.name}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">电话：</span>
                      <a href={`tel:${app.phone}`} className="text-primary hover:underline">
                        {app.phone}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">邮箱：</span>
                      <a href={`mailto:${app.email}`} className="text-primary hover:underline">
                        {app.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">城市：</span>
                      {app.city}
                    </div>
                  </div>
                </div>
              </div>

              {app.message && (
                <div className="mb-4 p-3 bg-secondary/50 rounded text-sm">
                  <span className="font-medium text-foreground">留言：</span>
                  <p className="text-muted-foreground mt-1">{app.message}</p>
                </div>
              )}

              {app.notes && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm border border-blue-200 dark:border-blue-800">
                  <span className="font-medium text-foreground">备注：</span>
                  <p className="text-muted-foreground mt-1">{app.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  提交时间：{new Date(app.created_at).toLocaleString('zh-CN')}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedApp(app)
                      setNotes(app.notes || '')
                    }}
                  >
                    {app.notes ? '编辑备注' : '添加备注'}
                  </Button>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="px-3 py-1.5 text-sm border border-border rounded bg-background text-foreground"
                  >
                    <option value="pending">待处理</option>
                    <option value="contacted">已联系</option>
                    <option value="rejected">已拒绝</option>
                    <option value="partnered">已合作</option>
                  </select>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Notes Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {selectedApp.notes ? '编辑备注' : '添加备注'}
              </h2>
              <button
                onClick={() => {
                  setSelectedApp(null)
                  setNotes("")
                }}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">申请人：</p>
                <p className="font-semibold">{selectedApp.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">城市：</p>
                <p className="text-sm">{selectedApp.city}</p>
              </div>
              {selectedApp.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">留言：</p>
                  <p className="text-sm">{selectedApp.message}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">备注内容：</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="添加处理备注或审核意见..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedApp(null)
                    setNotes("")
                  }}
                  className="flex-1"
                  disabled={isSaving}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSaveNotes}
                  className="flex-1"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存备注'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
