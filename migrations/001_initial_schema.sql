-- Supabase 初始数据库架构
-- 潮来餐厅连锁网站数据库
-- 创建时间: 2025-01

-- ============================================
-- 1. 扩展 UUID 支持
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 用户配置表
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 门店表
-- ============================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  dianping_url TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. 菜单项表
-- ============================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('main', 'side', 'drink')),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  description TEXT,
  spicy_level INTEGER DEFAULT 0 CHECK (spicy_level BETWEEN 0 AND 3),
  is_bestseller BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 加盟申请表
-- ============================================
CREATE TABLE franchise_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'rejected', 'partnered')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加邮箱索引以加快重复检查
CREATE INDEX idx_franchise_applications_email ON franchise_applications(email);
CREATE INDEX idx_franchise_applications_status ON franchise_applications(status);
CREATE INDEX idx_franchise_applications_created_at ON franchise_applications(created_at DESC);

CREATE TRIGGER update_franchise_applications_updated_at
  BEFORE UPDATE ON franchise_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. 行级安全策略 (RLS)
-- ============================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_applications ENABLE ROW LEVEL SECURITY;

-- ===== profiles 策略 =====

-- 用户只能查看自己的配置
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 用户可以更新自己的配置
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 管理员可以查看所有配置
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===== stores 策略 =====

-- 所有人可以查看激活的门店（前台展示）
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  USING (is_active = TRUE);

-- 管理员可以查看所有门店
CREATE POLICY "Admins can view all stores"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以插入门店
CREATE POLICY "Admins can insert stores"
  ON stores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以更新门店
CREATE POLICY "Admins can update stores"
  ON stores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以删除门店
CREATE POLICY "Admins can delete stores"
  ON stores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===== menu_items 策略 =====

-- 所有人可以查看可用的菜单项（前台展示）
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = TRUE);

-- 管理员可以查看所有菜单项
CREATE POLICY "Admins can view all menu items"
  ON menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以插入菜单项
CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以更新菜单项
CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以删除菜单项
CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===== franchise_applications 策略 =====

-- 所有人可以插入加盟申请（公开表单）
CREATE POLICY "Anyone can insert franchise applications"
  ON franchise_applications FOR INSERT
  WITH CHECK (TRUE);

-- 只有管理员可以查看申请
CREATE POLICY "Admins can view all applications"
  ON franchise_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以更新申请状态
CREATE POLICY "Admins can update applications"
  ON franchise_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 只有管理员可以删除申请
CREATE POLICY "Admins can delete applications"
  ON franchise_applications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 7. 初始数据迁移
-- ============================================

-- 迁移现有门店数据
INSERT INTO stores (name, address, phone, hours, description, latitude, longitude, dianping_url, sort_order)
VALUES
  ('潮来中山路旗舰店', '广东省汕头市中山路123号', '0754-8888-0001', '10:00-22:00',
   '我们的首家旗舰店，集传统美食与现代用餐环境为一体',
   23.3563, 116.6802, 'https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5', 1),

  ('潮来金砂路分店', '广东省汕头市金砂路456号', '0754-8888-0002', '10:00-22:30',
   '位于市中心商业区，交通便利，停车场宽敞',
   23.3579, 116.6895, 'https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5', 2),

  ('潮来东厦路旗舰店', '广东省汕头市东厦路789号', '0754-8888-0003', '10:00-22:00',
   '新开业分店，提供更舒适的用餐体验',
   23.3412, 116.6745, 'https://www.dianping.com/search/keyword/9/0_%E6%BD%AE%E6%9D%A5', 3);

-- 迁移现有菜单数据
INSERT INTO menu_items (name, category, price, description, spicy_level, is_bestseller, sort_order)
VALUES
  -- 主食类
  ('潮汕牛肉粿粉', 'main', 18.00, '精选汕头牛肉，传统手工制作牛肉粿粉，口感鲜香', 2, TRUE, 1),
  ('潮汕牛肉丸粉', 'main', 16.00, '手工牛肉丸配软滑牛肉粿粉，每一口都是美味', 1, TRUE, 2),
  ('牛肉汤粉', 'main', 15.00, '用8小时熬制的浓汤，牛肉鲜嫩，汤色金黄', 0, FALSE, 3),
  ('混合肉粿粉', 'main', 20.00, '牛肉、牛肉丸、牛筋的完美组合，让您品尝多种口感', 1, FALSE, 4),

  -- 配菜类
  ('潮汕鹅肉饭', 'side', 22.00, '卤水鹅肉鲜香，配秘制酱汁，香气十足', 1, TRUE, 5),
  ('冬菜牛肉饼', 'side', 12.00, '酥脆饼皮，馅料饱满，冬菜香气扑鼻', 0, FALSE, 6),
  ('豆类蔬菜', 'side', 8.00, '时令蔬菜，清爽健康，搭配粿粉更佳', 0, FALSE, 7),

  -- 饮品类
  ('潮汕凤凰单丛茶', 'drink', 6.00, '精选单丛茶叶，香气悠长，回甘不断', 0, TRUE, 8),
  ('普洱老茶', 'drink', 8.00, '陈年普洱，滋味醇厚，茶香氤氲', 0, FALSE, 9),
  ('鲜果榨汁', 'drink', 10.00, '新鲜水果现榨，营养健康，清凉爽口', 0, FALSE, 10);

-- ============================================
-- 8. 实用函数
-- ============================================

-- 函数：检查24小时内是否有相同邮箱的申请
CREATE OR REPLACE FUNCTION check_recent_application(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM franchise_applications
    WHERE email = p_email
      AND created_at > NOW() - INTERVAL '24 hours'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 完成
-- ============================================

-- 验证查询
SELECT 'Tables created:' AS status;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

SELECT 'RLS policies created:' AS status;
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
