-- ============================================
-- 用餐小贴士管理
-- ============================================

-- 1. 创建用餐小贴士表
CREATE TABLE IF NOT EXISTS menu_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 插入默认小贴士
INSERT INTO menu_tips (content, sort_order) VALUES
  ('我们的所有菜品均采用新鲜食材，每日采购', 1),
  ('可根据个人口味调整辣度，请在点餐时告知', 2),
  ('支持团体聚餐预订，欢迎来电咨询', 3),
  ('菜单价格仅供参考，具体以门店为准', 4);

-- 3. 添加注释
COMMENT ON TABLE menu_tips IS '用餐小贴士表';
COMMENT ON COLUMN menu_tips.content IS '小贴士内容';
COMMENT ON COLUMN menu_tips.sort_order IS '排序顺序';
COMMENT ON COLUMN menu_tips.is_active IS '是否启用';

-- 4. 设置 RLS 策略
ALTER TABLE menu_tips ENABLE ROW LEVEL SECURITY;

-- 公开读取启用的小贴士
CREATE POLICY "Public can view active tips"
  ON menu_tips FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 管理员完全控制
CREATE POLICY "Authenticated users can manage tips"
  ON menu_tips FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
