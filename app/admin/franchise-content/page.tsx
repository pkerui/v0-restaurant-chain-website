"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Loader2, X, MoveUp, MoveDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type FranchiseBenefit = Database['public']['Tables']['franchise_benefits']['Row']
type FranchiseBenefitInsert = Database['public']['Tables']['franchise_benefits']['Insert']
type FranchiseBenefitUpdate = Database['public']['Tables']['franchise_benefits']['Update']

type FranchiseRequirement = Database['public']['Tables']['franchise_requirements']['Row']
type FranchiseRequirementInsert = Database['public']['Tables']['franchise_requirements']['Insert']
type FranchiseRequirementUpdate = Database['public']['Tables']['franchise_requirements']['Update']

type FranchiseProcess = Database['public']['Tables']['franchise_process']['Row']
type FranchiseProcessInsert = Database['public']['Tables']['franchise_process']['Insert']
type FranchiseProcessUpdate = Database['public']['Tables']['franchise_process']['Update']

type TabType = 'benefits' | 'requirements' | 'process'

// 可用图标
const ICON_OPTIONS = [
  { value: 'Award', label: '奖杯 🏆' },
  { value: 'TrendingUp', label: '上升趋势 📈' },
  { value: 'Users', label: '用户团队 👥' },
  { value: 'CheckCircle2', label: '勾选 ✅' },
  { value: 'Star', label: '星星 ⭐' },
  { value: 'Target', label: '目标 🎯' },
  { value: 'Zap', label: '闪电 ⚡' },
  { value: 'Shield', label: '盾牌 🛡️' },
]

export default function FranchiseContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('benefits')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Benefits state
  const [benefits, setBenefits] = useState<FranchiseBenefit[]>([])
  const [benefitFormOpen, setBenefitFormOpen] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState<FranchiseBenefit | null>(null)
  const [benefitForm, setBenefitForm] = useState({
    icon: 'Award',
    title: '',
    description: '',
    sort_order: 0,
    is_active: true,
  })

  // Requirements state
  const [requirements, setRequirements] = useState<FranchiseRequirement[]>([])
  const [requirementFormOpen, setRequirementFormOpen] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<FranchiseRequirement | null>(null)
  const [requirementForm, setRequirementForm] = useState({
    content: '',
    sort_order: 0,
    is_active: true,
  })

  // Process state
  const [processes, setProcesses] = useState<FranchiseProcess[]>([])
  const [processFormOpen, setProcessFormOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<FranchiseProcess | null>(null)
  const [processForm, setProcessForm] = useState({
    step_number: 1,
    title: '',
    description: '',
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    loadAllData()
  }, [])

  // 防止模态框打开时背景滚动
  useEffect(() => {
    if (benefitFormOpen || requirementFormOpen || processFormOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [benefitFormOpen, requirementFormOpen, processFormOpen])

  const loadAllData = async () => {
    setIsLoading(true)
    await Promise.all([loadBenefits(), loadRequirements(), loadProcesses()])
    setIsLoading(false)
  }

  const loadBenefits = async () => {
    const { data } = await supabase.from('franchise_benefits').select('*').order('sort_order')
    setBenefits(data || [])
  }

  const loadRequirements = async () => {
    const { data } = await supabase.from('franchise_requirements').select('*').order('sort_order')
    setRequirements(data || [])
  }

  const loadProcesses = async () => {
    const { data } = await supabase.from('franchise_process').select('*').order('sort_order')
    setProcesses(data || [])
  }

  // Benefit handlers
  const handleOpenBenefitForm = (item?: FranchiseBenefit) => {
    if (item) {
      setEditingBenefit(item)
      setBenefitForm({
        icon: item.icon,
        title: item.title,
        description: item.description,
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
    } else {
      setEditingBenefit(null)
      setBenefitForm({
        icon: 'Award',
        title: '',
        description: '',
        sort_order: benefits.length + 1,
        is_active: true,
      })
    }
    setBenefitFormOpen(true)
  }

  const handleSubmitBenefit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingBenefit) {
        await supabase.from('franchise_benefits').update(benefitForm as FranchiseBenefitUpdate).eq('id', editingBenefit.id)
      } else {
        await supabase.from('franchise_benefits').insert(benefitForm as FranchiseBenefitInsert)
      }
      await loadBenefits()
      setBenefitFormOpen(false)
    } catch (error: any) {
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBenefit = async (item: FranchiseBenefit) => {
    if (!confirm(`确定要删除"${item.title}"吗？`)) return
    await supabase.from('franchise_benefits').delete().eq('id', item.id)
    loadBenefits()
  }

  const handleToggleBenefitActive = async (item: FranchiseBenefit) => {
    await supabase.from('franchise_benefits').update({ is_active: !item.is_active }).eq('id', item.id)
    loadBenefits()
  }

  const handleMoveBenefit = async (item: FranchiseBenefit, direction: 'up' | 'down') => {
    const index = benefits.findIndex(b => b.id === item.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= benefits.length) return
    const target = benefits[targetIndex]
    await Promise.all([
      supabase.from('franchise_benefits').update({ sort_order: target.sort_order }).eq('id', item.id),
      supabase.from('franchise_benefits').update({ sort_order: item.sort_order }).eq('id', target.id)
    ])
    loadBenefits()
  }

  // Requirement handlers
  const handleOpenRequirementForm = (item?: FranchiseRequirement) => {
    if (item) {
      setEditingRequirement(item)
      setRequirementForm({
        content: item.content,
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
    } else {
      setEditingRequirement(null)
      setRequirementForm({
        content: '',
        sort_order: requirements.length + 1,
        is_active: true,
      })
    }
    setRequirementFormOpen(true)
  }

  const handleSubmitRequirement = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingRequirement) {
        await supabase.from('franchise_requirements').update(requirementForm as FranchiseRequirementUpdate).eq('id', editingRequirement.id)
      } else {
        await supabase.from('franchise_requirements').insert(requirementForm as FranchiseRequirementInsert)
      }
      await loadRequirements()
      setRequirementFormOpen(false)
    } catch (error: any) {
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRequirement = async (item: FranchiseRequirement) => {
    if (!confirm(`确定要删除这条加盟条件吗？`)) return
    await supabase.from('franchise_requirements').delete().eq('id', item.id)
    loadRequirements()
  }

  const handleToggleRequirementActive = async (item: FranchiseRequirement) => {
    await supabase.from('franchise_requirements').update({ is_active: !item.is_active }).eq('id', item.id)
    loadRequirements()
  }

  const handleMoveRequirement = async (item: FranchiseRequirement, direction: 'up' | 'down') => {
    const index = requirements.findIndex(r => r.id === item.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= requirements.length) return
    const target = requirements[targetIndex]
    await Promise.all([
      supabase.from('franchise_requirements').update({ sort_order: target.sort_order }).eq('id', item.id),
      supabase.from('franchise_requirements').update({ sort_order: item.sort_order }).eq('id', target.id)
    ])
    loadRequirements()
  }

  // Process handlers
  const handleOpenProcessForm = (item?: FranchiseProcess) => {
    if (item) {
      setEditingProcess(item)
      setProcessForm({
        step_number: item.step_number,
        title: item.title,
        description: item.description,
        sort_order: item.sort_order,
        is_active: item.is_active,
      })
    } else {
      setEditingProcess(null)
      setProcessForm({
        step_number: processes.length + 1,
        title: '',
        description: '',
        sort_order: processes.length + 1,
        is_active: true,
      })
    }
    setProcessFormOpen(true)
  }

  const handleSubmitProcess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingProcess) {
        await supabase.from('franchise_process').update(processForm as FranchiseProcessUpdate).eq('id', editingProcess.id)
      } else {
        await supabase.from('franchise_process').insert(processForm as FranchiseProcessInsert)
      }
      await loadProcesses()
      setProcessFormOpen(false)
    } catch (error: any) {
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProcess = async (item: FranchiseProcess) => {
    if (!confirm(`确定要删除"${item.title}"吗？`)) return
    await supabase.from('franchise_process').delete().eq('id', item.id)
    loadProcesses()
  }

  const handleToggleProcessActive = async (item: FranchiseProcess) => {
    await supabase.from('franchise_process').update({ is_active: !item.is_active }).eq('id', item.id)
    loadProcesses()
  }

  const handleMoveProcess = async (item: FranchiseProcess, direction: 'up' | 'down') => {
    const index = processes.findIndex(p => p.id === item.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= processes.length) return
    const target = processes[targetIndex]
    await Promise.all([
      supabase.from('franchise_process').update({ sort_order: target.sort_order }).eq('id', item.id),
      supabase.from('franchise_process').update({ sort_order: item.sort_order }).eq('id', target.id)
    ])
    loadProcesses()
  }

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
      <div>
        <h1 className="text-2xl font-bold">加盟信息管理</h1>
        <p className="text-muted-foreground">管理加盟优势、加盟条件和加盟流程</p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">ℹ️</div>
          <div className="text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">使用说明</p>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>加盟优势</strong>：显示在加盟页面，展示品牌优势和卖点</li>
              <li>• <strong>加盟条件</strong>：列出加盟商需要满足的条件</li>
              <li>• <strong>加盟流程</strong>：展示从申请到开业的步骤</li>
              <li>• 使用上下箭头调整显示顺序，禁用的内容不会在前台显示</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          {[
            { key: 'benefits' as TabType, label: '加盟优势' },
            { key: 'requirements' as TabType, label: '加盟条件' },
            { key: 'process' as TabType, label: '加盟流程' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">加盟优势列表</h2>
            <Button onClick={() => handleOpenBenefitForm()}>
              <Plus className="w-4 h-4 mr-2" />
              添加优势
            </Button>
          </div>

          <div className="grid gap-4">
            {benefits.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">还没有加盟优势，点击上方按钮添加</p>
              </Card>
            ) : (
              benefits.map((item, index) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveBenefit(item, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveBenefit(item, 'down')}
                          disabled={index === benefits.length - 1}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-muted-foreground">图标: {item.icon}</span>
                          {!item.is_active && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">已禁用</span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.is_active ? '已启用' : '已禁用'}</span>
                        <button
                          onClick={() => handleToggleBenefitActive(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.is_active ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleOpenBenefitForm(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBenefit(item)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">加盟条件列表</h2>
            <Button onClick={() => handleOpenRequirementForm()}>
              <Plus className="w-4 h-4 mr-2" />
              添加条件
            </Button>
          </div>

          <div className="grid gap-4">
            {requirements.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">还没有加盟条件，点击上方按钮添加</p>
              </Card>
            ) : (
              requirements.map((item, index) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveRequirement(item, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveRequirement(item, 'down')}
                          disabled={index === requirements.length - 1}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1">
                        {!item.is_active && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mb-2 inline-block">已禁用</span>
                        )}
                        <p className="text-foreground">{item.content}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.is_active ? '已启用' : '已禁用'}</span>
                        <button
                          onClick={() => handleToggleRequirementActive(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.is_active ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleOpenRequirementForm(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteRequirement(item)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Process Tab */}
      {activeTab === 'process' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">加盟流程列表</h2>
            <Button onClick={() => handleOpenProcessForm()}>
              <Plus className="w-4 h-4 mr-2" />
              添加流程
            </Button>
          </div>

          <div className="grid gap-4">
            {processes.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">还没有加盟流程，点击上方按钮添加</p>
              </Card>
            ) : (
              processes.map((item, index) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveProcess(item, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveProcess(item, 'down')}
                          disabled={index === processes.length - 1}
                          className="p-1 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {item.step_number}
                          </span>
                          {!item.is_active && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">已禁用</span>
                          )}
                        </div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{item.is_active ? '已启用' : '已禁用'}</span>
                        <button
                          onClick={() => handleToggleProcessActive(item)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.is_active ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleOpenProcessForm(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProcess(item)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Benefit Form Modal */}
      {benefitFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center py-8">
            <Card className="w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingBenefit ? '编辑加盟优势' : '添加加盟优势'}</h2>
              <button onClick={() => setBenefitFormOpen(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBenefit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">图标 *</label>
                <select
                  value={benefitForm.icon}
                  onChange={e => setBenefitForm({ ...benefitForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  required
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">标题 *</label>
                <Input
                  value={benefitForm.title}
                  onChange={e => setBenefitForm({ ...benefitForm, title: e.target.value })}
                  placeholder="例如: 品牌力量"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">描述 *</label>
                <Textarea
                  value={benefitForm.description}
                  onChange={e => setBenefitForm({ ...benefitForm, description: e.target.value })}
                  placeholder="详细描述这个优势"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">排序</label>
                <Input
                  type="number"
                  value={benefitForm.sort_order}
                  onChange={e => setBenefitForm({ ...benefitForm, sort_order: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={benefitForm.is_active}
                  onChange={e => setBenefitForm({ ...benefitForm, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">启用此优势</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setBenefitFormOpen(false)} className="flex-1" disabled={isSubmitting}>
                  取消
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />保存中...</> : '保存'}
                </Button>
              </div>
            </form>
            </Card>
          </div>
        </div>
      )}

      {/* Requirement Form Modal */}
      {requirementFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center py-8">
            <Card className="w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingRequirement ? '编辑加盟条件' : '添加加盟条件'}</h2>
              <button onClick={() => setRequirementFormOpen(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequirement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">条件内容 *</label>
                <Textarea
                  value={requirementForm.content}
                  onChange={e => setRequirementForm({ ...requirementForm, content: e.target.value })}
                  placeholder="例如: 热爱美食行业，具有餐饮业经营经验优先"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">排序</label>
                <Input
                  type="number"
                  value={requirementForm.sort_order}
                  onChange={e => setRequirementForm({ ...requirementForm, sort_order: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requirementForm.is_active}
                  onChange={e => setRequirementForm({ ...requirementForm, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">启用此条件</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setRequirementFormOpen(false)} className="flex-1" disabled={isSubmitting}>
                  取消
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />保存中...</> : '保存'}
                </Button>
              </div>
            </form>
            </Card>
          </div>
        </div>
      )}

      {/* Process Form Modal */}
      {processFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center py-8">
            <Card className="w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingProcess ? '编辑加盟流程' : '添加加盟流程'}</h2>
              <button onClick={() => setProcessFormOpen(false)} className="p-1 hover:bg-secondary rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProcess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">步骤序号 *</label>
                <Input
                  type="number"
                  value={processForm.step_number}
                  onChange={e => setProcessForm({ ...processForm, step_number: Number(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">步骤标题 *</label>
                <Input
                  value={processForm.title}
                  onChange={e => setProcessForm({ ...processForm, title: e.target.value })}
                  placeholder="例如: 提交申请"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">步骤描述 *</label>
                <Input
                  value={processForm.description}
                  onChange={e => setProcessForm({ ...processForm, description: e.target.value })}
                  placeholder="例如: 填写申请表格"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">排序</label>
                <Input
                  type="number"
                  value={processForm.sort_order}
                  onChange={e => setProcessForm({ ...processForm, sort_order: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={processForm.is_active}
                  onChange={e => setProcessForm({ ...processForm, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">启用此流程</label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setProcessFormOpen(false)} className="flex-1" disabled={isSubmitting}>
                  取消
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />保存中...</> : '保存'}
                </Button>
              </div>
            </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
