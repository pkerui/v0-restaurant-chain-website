-- 创建品牌风采图片表
-- 用于存储"关于我们"页面的品牌风采轮播图片

CREATE TABLE brand_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_brand_gallery_sort_order ON brand_gallery(sort_order);
CREATE INDEX idx_brand_gallery_is_active ON brand_gallery(is_active);

-- 触发器：自动更新 updated_ata
CREATE TRIGGER update_brand_gallery_updated_at
  BEFORE UPDATE ON brand_gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS
ALTER TABLE brand_gallery ENABLE ROW LEVEL SECURITY;

-- 公共访问策略：任何人（包括未登录用户）可以查看激活的图片
CREATE POLICY "Public can view active gallery images"
  ON brand_gallery FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 认证用户也可以查看激活的图片
CREATE POLICY "Authenticated users can view active gallery images"
  ON brand_gallery FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- 管理员可以查看所有图片
CREATE POLICY "Admins can view all gallery images"
  ON brand_gallery FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以插入图片
CREATE POLICY "Admins can insert gallery images"
  ON brand_gallery FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以更新图片
CREATE POLICY "Admins can update gallery images"
  ON brand_gallery FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以删除图片
CREATE POLICY "Admins can delete gallery images"
  ON brand_gallery FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 插入默认数据
INSERT INTO brand_gallery (image_url, alt_text, sort_order) VALUES
  ('https://images.unsplash.com/photo-1555939594-58056f625634?w=800&h=500&fit=crop', '地道潮汕牛肉粿汁', 1),
  ('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=500&fit=crop', '中山路旗舰店', 2),
  ('https://images.unsplash.com/photo-1556909114-f6e7ad7d3137?w=800&h=500&fit=crop', '专业烹饪团队', 3),
  ('https://images.unsplash.com/photo-1574651351432-30f9a1e7e2f0?w=800&h=500&fit=crop', '新鲜食材选购', 4);

-- 验证创建
SELECT COUNT(*) as total_images FROM brand_gallery;
