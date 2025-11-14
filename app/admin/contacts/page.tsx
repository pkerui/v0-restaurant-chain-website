"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Phone, Search, X, FileDown, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { ContactSubmission } from "@/lib/supabase/types"

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = filterStatus === "all" || submission.status === filterStatus
    const matchesSearch = searchQuery === "" ||
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.phone.includes(searchQuery) ||
      submission.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleUpdateStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setSubmissions(prev => prev.map(sub =>
        sub.id === id ? { ...sub, status } : sub
      ))

      // 触发自定义事件通知父组件刷新未读数量
      console.log('联系表单状态已更新，触发刷新事件')
      window.dispatchEvent(new CustomEvent('refreshUnreadCounts'))
    } catch (error: any) {
      console.error('更新失败:', error)
      alert('更新失败: ' + error.message)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          notes,
          status: 'read' // 添加备注时自动标记为已读
        })
        .eq('id', selectedSubmission.id)

      if (error) throw error

      setSubmissions(prev => prev.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, notes, status: 'read' }
          : sub
      ))

      // 触发自定义事件通知父组件刷新未读数量
      console.log('联系表单备注已保存，触发刷新事件')
      window.dispatchEvent(new CustomEvent('refreshUnreadCounts'))

      alert('保存成功！')
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除来自 "${name}" 的联系表单吗？此操作无法撤销。`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // 从列表中移除
      setSubmissions(prev => prev.filter(sub => sub.id !== id))

      // 如果删除的是当前选中的，关闭详情面板
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
        setNotes("")
      }

      // 触发刷新未读数量
      window.dispatchEvent(new CustomEvent('refreshUnreadCounts'))

      alert('删除成功！')
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  const handleExport = () => {
    const csv = [
      ['姓名', '邮箱', '电话', '消息', '状态', '备注', '提交时间'],
      ...filteredSubmissions.map(sub => [
        sub.name,
        sub.email,
        sub.phone,
        sub.message,
        getStatusLabel(sub.status),
        sub.notes || '',
        new Date(sub.created_at).toLocaleString('zh-CN')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `联系表单_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      unread: '未读',
      read: '已读',
      replied: '已回复'
    }
    return map[status] || status
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      unread: 'bg-yellow-500',
      read: 'bg-blue-500',
      replied: 'bg-green-500'
    }
    return map[status] || 'bg-gray-500'
  }

  const unreadCount = submissions.filter(s => s.status === 'unread').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">联系表单提交</h1>
          <p className="text-muted-foreground">
            共 {submissions.length} 条提交
            {unreadCount > 0 && (
              <span className="ml-2 text-yellow-600 font-semibold">
                （{unreadCount} 条未读）
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          导出 CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: '全部' },
            { id: 'unread', label: '未读' },
            { id: 'read', label: '已读' },
            { id: 'replied', label: '已回复' }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setFilterStatus(status.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {status.label}
              {status.id !== 'all' && (
                <span className="ml-2 text-xs">
                  ({submissions.filter(s => s.status === status.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索姓名、邮箱、电话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid gap-4">
        {filteredSubmissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">没有找到提交记录</p>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{submission.name}</h3>
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusLabel(submission.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {submission.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {submission.phone}
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{submission.message}</p>
                  {submission.notes && (
                    <div className="bg-secondary/20 rounded-lg p-3 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">备注：</p>
                      <p className="text-sm">{submission.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(submission)
                    setNotes(submission.notes || '')
                  }}
                >
                  添加备注
                </Button>

                {/* 状态切换按钮 */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={submission.status === 'unread' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(submission.id, 'unread')}
                    disabled={submission.status === 'unread'}
                  >
                    标记未读
                  </Button>
                  <Button
                    size="sm"
                    variant={submission.status === 'read' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(submission.id, 'read')}
                    disabled={submission.status === 'read'}
                  >
                    标记已读
                  </Button>
                  <Button
                    size="sm"
                    variant={submission.status === 'replied' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(submission.id, 'replied')}
                    disabled={submission.status === 'replied'}
                  >
                    标记已回复
                  </Button>
                </div>

                {/* 删除按钮 */}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => handleDelete(submission.id, submission.name)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Notes Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">添加备注</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">姓名：</p>
                <p className="font-semibold">{selectedSubmission.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">消息：</p>
                <p className="text-sm">{selectedSubmission.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">备注内容：</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="添加处理备注..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
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
