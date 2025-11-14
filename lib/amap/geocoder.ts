/**
 * 高德地图地理编码工具
 * 将地址转换为经纬度坐标
 */

import { AMAP_CONFIG } from './config'

export interface GeocodeResult {
  longitude: number
  latitude: number
  formattedAddress: string
}

/**
 * 地址转坐标（地理编码）
 * @param address 详细地址
 * @param city 城市名称（可选，提高准确度）
 * @param key 高德地图API Key（可选，默认使用配置文件中的 Key）
 * @returns 经纬度坐标
 */
export async function geocodeAddress(
  address: string,
  city: string = '汕头市',
  key: string = AMAP_CONFIG.webServiceKey
): Promise<GeocodeResult> {
  try {
    // 使用高德地图Web服务API的地理编码接口
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}`

    console.log('正在调用地理编码API:', url)

    const response = await fetch(url)
    const data = await response.json()

    console.log('API返回数据:', data)

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const result = data.geocodes[0]
      const [longitude, latitude] = result.location.split(',').map(Number)

      return {
        longitude,
        latitude,
        formattedAddress: result.formatted_address || address
      }
    } else {
      // 返回更详细的错误信息
      const errorMsg = data.info || data.infocode || '地址解析失败'
      console.error('API返回错误:', errorMsg, data)
      throw new Error(`高德地图API错误: ${errorMsg} (状态码: ${data.status}, 信息码: ${data.infocode})`)
    }
  } catch (error: any) {
    console.error('地理编码失败:', error)
    // 如果是我们自己抛出的错误，直接传递
    if (error.message.includes('高德地图API错误')) {
      throw error
    }
    // 网络错误或其他错误
    throw new Error(`网络请求失败: ${error.message}`)
  }
}

/**
 * 批量地址转坐标
 * @param addresses 地址数组
 * @param city 城市名称
 * @param key 高德地图API Key（可选，默认使用配置文件中的 Key）
 * @returns 坐标数组
 */
export async function batchGeocodeAddresses(
  addresses: string[],
  city: string = '汕头市',
  key: string = AMAP_CONFIG.webServiceKey
): Promise<GeocodeResult[]> {
  const results: GeocodeResult[] = []

  // 逐个处理（避免API限流）
  for (const address of addresses) {
    try {
      const result = await geocodeAddress(address, city, key)
      results.push(result)

      // 延迟100ms，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`地址 "${address}" 解析失败:`, error)
      // 继续处理下一个
    }
  }

  return results
}
