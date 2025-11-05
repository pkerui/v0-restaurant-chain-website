/**
 * 美团店铺配置
 * 存储每家潮来店铺对应的美团店铺ID
 *
 * 使用说明:
 * 1. 在美团商家后台获取每家店的店铺ID
 * 2. 将ID填入下方对应位置
 * 3. 前端会自动生成美团外卖链接
 */

interface StoreConfig {
  name: string
  meituanStoreId: string | null // 美团店铺ID，如果为null则表示未开通美团
  meituanDeliveryUrl?: string
}

export const meituanStores: Record<string, StoreConfig> = {
  "flagship-zhongshan": {
    name: "潮来中山路旗舰店",
    meituanStoreId: null, // TODO: 填入美团店铺ID
    meituanDeliveryUrl: "https://waimai.meituan.com/restaurant/0", // 示例URL
  },
  "branch-jinsha": {
    name: "潮来金砂路分店",
    meituanStoreId: null, // TODO: 填入美团店铺ID
    meituanDeliveryUrl: "https://waimai.meituan.com/restaurant/0",
  },
  "branch-dongxia": {
    name: "潮来东厦路旗舰店",
    meituanStoreId: null, // TODO: 填入美团店铺ID
    meituanDeliveryUrl: "https://waimai.meituan.com/restaurant/0",
  },
}

/**
 * 根据店铺ID获取美团配置
 * @param storeKey - 店铺键值
 * @returns 店铺配置对象
 */
export function getMeituanStoreConfig(storeKey: string): StoreConfig | null {
  return meituanStores[storeKey] || null
}

/**
 * 获取所有已开通美团的店铺
 * @returns 美团店铺列表
 */
export function getActiveMeituanStores(): StoreConfig[] {
  return Object.values(meituanStores).filter((store) => store.meituanStoreId !== null)
}
