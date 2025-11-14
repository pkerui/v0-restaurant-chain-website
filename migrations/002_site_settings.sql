-- 站点设置表
-- 用于存储各页面的可编辑文本内容

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  page TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_site_settings_page ON site_settings(page);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- 触发器：自动更新 updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看设置（前台展示）
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (TRUE);

-- 只有管理员可以更新设置
CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以插入设置
CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以删除设置
CREATE POLICY "Admins can delete site settings"
  ON site_settings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 插入默认设置数据
INSERT INTO site_settings (key, value, description, page) VALUES
  -- 首页
  ('home_hero_title', '潮来', '首页大标题', 'home'),
  ('home_hero_subtitle', '正宗潮汕牛肉粿粉', '首页副标题', 'home'),
  ('home_hero_description', '三代美食传承 · 诚邀加盟合伙人', '首页描述', 'home'),
  ('home_why_title', '为什么选择潮来', '首页特色标题', 'home'),
  ('home_why_description', '我们坚持传统工艺与现代经营相结合，为顾客提供最地道的潮汕美食体验', '首页特色描述', 'home'),

  -- 门店页面
  ('stores_page_title', '我们的门店', '门店页面标题', 'stores'),
  ('stores_page_description', '三家直营店遍布汕头市中心，为您提供地道的潮汕美食体验', '门店页面描述', 'stores'),
  ('stores_map_title', '门店位置地图', '地图区域标题', 'stores'),

  -- 菜单页面
  ('menu_page_title', '潮来菜单', '菜单页面标题', 'menu'),
  ('menu_page_description', '传统潮汕美食，每一道都是用心烹饪的经典之作', '菜单页面描述', 'menu'),
  ('menu_tips_title', '用餐小贴士', '小贴士标题', 'menu'),

  -- 评价页面
  ('reviews_page_title', '顾客评价', '评价页面标题', 'reviews'),
  ('reviews_page_description', '听听我们的顾客怎么说，每一条评价都是对潮来最大的鼓励', '评价页面描述', 'reviews'),
  ('reviews_cta_title', '想看更多真实评价？', '跳转大众点评标题', 'reviews'),
  ('reviews_cta_description', '访问大众点评，查看数千条来自真实顾客的评价和门店照片', '跳转大众点评描述', 'reviews'),

  -- 加盟页面
  ('franchise_page_title', '加盟潮来', '加盟页面标题', 'franchise'),
  ('franchise_page_description', '加入我们的行列，成为潮来的合作伙伴，共同开创美食事业新局面', '加盟页面描述', 'franchise'),
  ('franchise_form_title', '立即申请', '申请表单标题', 'franchise'),
  ('franchise_form_description', '填写下方表格，我们将在24小时内与您联系', '申请表单描述', 'franchise'),

  -- 关于页面
  ('about_page_title', '关于潮来', '关于页面标题', 'about'),
  ('about_page_description', '传承三代的潮汕美食品牌', '关于页面描述', 'about'),

  -- 联系页面
  ('contact_page_title', '联系我们', '联系页面标题', 'contact'),
  ('contact_page_description', '我们期待听到您的声音', '联系页面描述', 'contact');

-- 验证插入
SELECT COUNT(*) as total_settings FROM site_settings;
