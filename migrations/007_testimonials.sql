-- 创建顾客评价表
-- 用于存储首页和评价页面的顾客评价

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  avatar TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- 添加索引
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_sort_order ON testimonials(sort_order);

-- 触发器：自动更新 updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 公共访问策略：任何人可以查看激活的评价
CREATE POLICY "Public can view active testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 认证用户也可以查看激活的评价
CREATE POLICY "Authenticated users can view active testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- 管理员可以查看所有评价
CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以插入评价
CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以更新评价
CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以删除评价
CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 插入默认数据
INSERT INTO testimonials (name, role, content, rating, avatar, sort_order) VALUES
  ('王先生', '常客', '潮来的牛肉粿粉真的绝了！牛肉鲜嫩，粿粉软滑，每次来都要吃。五年的忠实粉丝！', 5, '王', 1),
  ('李女士', '美食爱好者', '在潮来吃了一次就爱上了，地道的潮汕味道，价格也很公道。推荐给所有朋友！', 5, '李', 2),
  ('张先生', '上班族', '工作太忙经常点外卖，潮来的快手粿粉让我节省了很多时间，味道还特别好。', 5, '张', 3);

-- 验证创建
SELECT COUNT(*) as total_testimonials FROM testimonials;
