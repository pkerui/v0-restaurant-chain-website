"use client"

import { useEffect, useRef } from "react"
import { AMAP_CONFIG } from "@/lib/amap/config"

interface Store {
  id: string
  name: string
  address: string
  phone: string
  latitude?: number | null
  longitude?: number | null
}

interface AMapProps {
  stores: Store[]
  height?: string
}

declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

export default function AMap({ stores, height = "500px" }: AMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    // 高德地图安全密钥配置
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_CONFIG.securityJsCode,
    }

    // 动态加载高德地图 JavaScript API
    if (!window.AMap) {
      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=${AMAP_CONFIG.version}&key=${AMAP_CONFIG.key}`
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      // 清理地图实例
      if (mapInstance.current) {
        mapInstance.current.destroy()
      }
    }
  }, [stores])

  const initMap = () => {
    if (!mapContainer.current || !window.AMap) return

    // 过滤出有坐标的门店
    const validStores = stores.filter(store => store.latitude && store.longitude)

    if (validStores.length === 0) {
      // 如果没有有效坐标，显示汕头市中心
      const map = new window.AMap.Map(mapContainer.current, {
        zoom: 13,
        center: [116.681972, 23.354091], // 汕头市中心坐标
        viewMode: '3D',
      })
      mapInstance.current = map
      return
    }

    // 创建地图实例
    const map = new window.AMap.Map(mapContainer.current, {
      zoom: 13,
      viewMode: '3D',
    })

    mapInstance.current = map

    // 创建标记点数组
    const markers: any[] = []
    const bounds: [number, number][] = []

    validStores.forEach((store) => {
      if (!store.latitude || !store.longitude) return

      const position = [store.longitude, store.latitude]
      bounds.push(position as [number, number])

      // 创建自定义信息窗体内容
      const infoContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">
            ${store.name}
          </h3>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            <strong>地址：</strong>${store.address}
          </p>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            <strong>电话：</strong><a href="tel:${store.phone}" style="color: #1890ff;">${store.phone}</a>
          </p>
          <div style="margin-top: 12px;">
            <a
              href="https://ditu.amap.com/search?query=${store.name}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                padding: 6px 16px;
                background: #1890ff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 14px;
              "
            >
              导航到这里
            </a>
          </div>
        </div>
      `

      // 创建标记
      const marker = new window.AMap.Marker({
        position: position,
        title: store.name,
        map: map,
      })

      // 创建信息窗体
      const infoWindow = new window.AMap.InfoWindow({
        content: infoContent,
        offset: new window.AMap.Pixel(0, -30),
      })

      // 点击标记显示信息窗体
      marker.on('click', () => {
        infoWindow.open(map, marker.getPosition())
      })

      markers.push(marker)
    })

    // 自动调整地图视野以显示所有标记
    if (bounds.length > 0) {
      map.setFitView(markers, false, [50, 50, 50, 50])
    }

    // 添加地图控件（高德地图 2.0 版本）
    // 比例尺控件
    window.AMap.plugin(['AMap.Scale'], () => {
      const scale = new window.AMap.Scale()
      map.addControl(scale)
    })

    // 工具栏控件
    window.AMap.plugin(['AMap.ToolBar'], () => {
      const toolBar = new window.AMap.ToolBar()
      map.addControl(toolBar)
    })
  }

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: height,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  )
}
