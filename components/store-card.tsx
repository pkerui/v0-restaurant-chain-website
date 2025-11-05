"use client"

import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Store {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  description: string
  latitude?: number
  longitude?: number
}

export default function StoreCard({ store }: { store: Store }) {
  const meituan_url = "#"

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-secondary to-primary/20 flex items-center justify-center">
        <span className="text-5xl">🍲</span>
      </div>

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
          <a href={meituan_url} className="flex-1">
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <ExternalLink className="w-4 h-4 mr-1" />
              美团
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
