"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import StoreCard from "@/components/store-card"
import { MapIcon } from "lucide-react"

export default function StoresPage() {
  const stores = [
    {
      id: 1,
      name: "潮来中山路旗舰店",
      address: "广东省汕头市中山路123号",
      phone: "0754-8888-0001",
      hours: "10:00-22:00",
      description: "我们的首家旗舰店，集传统美食与现代用餐环境为一体",
      latitude: 23.3563,
      longitude: 116.6802,
    },
    {
      id: 2,
      name: "潮来金砂路分店",
      address: "广东省汕头市金砂路456号",
      phone: "0754-8888-0002",
      hours: "10:00-22:30",
      description: "位于市中心商业区，交通便利，停车场宽敞",
      latitude: 23.3579,
      longitude: 116.6895,
    },
    {
      id: 3,
      name: "潮来东厦路旗舰店",
      address: "广东省汕头市东厦路789号",
      phone: "0754-8888-0003",
      hours: "10:00-22:00",
      description: "新开业分店，提供更舒适的用餐体验",
      latitude: 23.3412,
      longitude: 116.6745,
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">我们的门店</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">三家直营店遍布汕头市中心，为您提供地道的潮汕美食体验</p>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>

          {/* Map Section */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8 text-center">门店位置地图</h2>
            <div className="bg-secondary/20 rounded-lg overflow-hidden h-[400px] md:h-[500px] border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">地图功能敬请期待</p>
                <p className="text-sm mt-2">我们的三家门店均位于汕头市中心商业区</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
