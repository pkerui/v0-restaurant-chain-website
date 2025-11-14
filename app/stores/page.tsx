"use client"

import { useEffect, useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import StoreCard from "@/components/store-card"
import AMap from "@/components/amap"
import { MapIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Store, SiteSetting } from "@/lib/supabase/types"

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({
    stores_page_title: "我们的门店",
    stores_page_description: "三家直营店遍布汕头市中心，为您提供地道的潮汕美食体验",
    stores_map_title: "门店位置地图"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load stores
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (storesError) throw storesError
      setStores(storesData || [])

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('page', 'stores')

      if (settingsError) throw settingsError

      // Convert array to key-value object
      if (settingsData) {
        const settingsObj: Record<string, string> = {}
        settingsData.forEach((setting: SiteSetting) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings(prev => ({ ...prev, ...settingsObj }))
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 转换数据格式以匹配 StoreCard 组件
  const formattedStores = stores.map(store => ({
    id: store.id,
    name: store.name,
    address: store.address,
    phone: store.phone,
    hours: store.hours,
    description: store.description || "",
    latitude: store.latitude,
    longitude: store.longitude,
    dianpingUrl: store.dianping_url,
    imageUrl: store.image_url,
  }))

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{settings.stores_page_title}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">{settings.stores_page_description}</p>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">加载中...</p>
              </div>
            </div>
          ) : formattedStores.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无门店信息</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {formattedStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}

          {/* Map Section */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8 text-center">{settings.stores_map_title}</h2>
            <div className="bg-secondary/20 rounded-lg overflow-hidden border border-border">
              <AMap stores={stores} height="500px" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
