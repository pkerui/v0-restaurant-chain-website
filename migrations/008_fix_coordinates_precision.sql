-- ============================================
-- 修复门店表经纬度字段精度
-- ============================================
--
-- 问题：原有的 DECIMAL(10,8) 和 DECIMAL(11,8) 精度不足
-- 解决：改为 DOUBLE PRECISION，可以存储更大范围和更高精度的坐标
--
-- DECIMAL(10,8) 只能存储 -99.99999999 到 99.99999999
-- DOUBLE PRECISION 可以存储任意合法的经纬度值（-180到180，-90到90）
-- ============================================

-- 修改 latitude 字段类型
ALTER TABLE stores
ALTER COLUMN latitude TYPE DOUBLE PRECISION;

-- 修改 longitude 字段类型
ALTER TABLE stores
ALTER COLUMN longitude TYPE DOUBLE PRECISION;

-- 添加注释说明
COMMENT ON COLUMN stores.latitude IS '纬度（Latitude），范围 -90 到 90';
COMMENT ON COLUMN stores.longitude IS '经度（Longitude），范围 -180 到 180';
