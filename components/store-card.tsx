"use client"

import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Store {
  id: number | string
  name: string
  address: string
  phone: string
  hours: string
  description: string
  latitude?: number | null
  longitude?: number | null
  dianpingUrl?: string | null
  imageUrl?: string | null
}

export default function StoreCard({ store }: { store: Store }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Store Image */}
      {store.imageUrl ? (
        <div className="w-full aspect-[4/3] overflow-hidden">
          <img
            src={store.imageUrl}
            alt={store.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-gradient-to-br from-secondary to-primary/20 flex items-center justify-center">
          <span className="text-5xl">🍲</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-foreground">{store.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{store.description}</p>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{store.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary flex-shrink-0" />
            <a href={`tel:${store.phone}`} className="text-sm text-primary hover:underline">
              {store.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">{store.hours}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`https://ditu.amap.com/search?query=${store.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              <MapPin className="w-4 h-4 mr-1" />
              导航
            </Button>
          </a>
          <a
            href={store.dianpingUrl || "https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <ExternalLink className="w-4 h-4 mr-1" />
              大众点评
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
