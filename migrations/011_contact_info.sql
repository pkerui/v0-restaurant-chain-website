-- 创建联系信息表
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL, -- 图标名称 (如: Phone, Mail, MapPin, Clock)
  label TEXT NOT NULL, -- 显示标签 (如: "联系电话", "邮箱地址")
  value TEXT NOT NULL, -- 实际内容
  link TEXT, -- 可选链接 (如: tel:xxx, mailto:xxx)
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认联系信息
INSERT INTO contact_info (icon, label, value, link, sort_order) VALUES
  ('Phone', '联系电话', '400-XXXX-XXXX', 'tel:400-xxxx-xxxx', 1),
  ('Mail', '邮箱地址', 'service@chaolai.com', 'mailto:service@chaolai.com', 2),
  ('MapPin', '公司地址', '广东省汕头市', NULL, 3),
  ('Clock', '营业时间', '10:00-22:00', NULL, 4)
ON CONFLICT DO NOTHING;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_contact_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_info_updated_at();

-- 设置 RLS 策略
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- 公开访问激活的联系信息
CREATE POLICY "公开查看激活的联系信息"
  ON contact_info
  FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 管理员完全访问权限
CREATE POLICY "管理员完全访问联系信息"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
