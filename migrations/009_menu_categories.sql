-- ============================================
-- 菜单分类管理
-- ============================================

-- 1. 创建菜单分类表
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 插入默认分类
INSERT INTO menu_categories (name, sort_order) VALUES
  ('主食', 1),
  ('配菜', 2),
  ('饮品', 3)
ON CONFLICT (name) DO NOTHING;

-- 3. 移除 menu_items 表的 category 约束
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;

-- 4. 添加注释
COMMENT ON TABLE menu_categories IS '菜单分类表';
COMMENT ON COLUMN menu_categories.name IS '分类名称';
COMMENT ON COLUMN menu_categories.sort_order IS '排序顺序';
COMMENT ON COLUMN menu_categories.is_active IS '是否启用';

-- 5. 设置 RLS 策略
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

-- 公开读取
CREATE POLICY "Public can view active categories"
  ON menu_categories FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 管理员完全控制
CREATE POLICY "Authenticated users can manage categories"
  ON menu_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
