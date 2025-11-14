-- 创建 Footer 配置表
CREATE TABLE IF NOT EXISTS footer_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT NOT NULL,
  brand_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认配置（只保留一条记录）
INSERT INTO footer_config (brand_name, brand_description) VALUES
  ('潮来', '正宗潮汕牛肉粿粉，传承三代美食工艺。我们用心为每位顾客奉献地道的潮汕美食。')
ON CONFLICT DO NOTHING;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_footer_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER footer_config_updated_at
  BEFORE UPDATE ON footer_config
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_config_updated_at();

-- 设置 RLS 策略
ALTER TABLE footer_config ENABLE ROW LEVEL SECURITY;

-- 公开访问 Footer 配置
CREATE POLICY "公开查看 Footer 配置"
  ON footer_config
  FOR SELECT
  TO public
  USING (true);

-- 管理员完全访问权限
CREATE POLICY "管理员完全访问 Footer 配置"
  ON footer_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 删除 site_settings 中的 footer 相关设置（如果存在）
DELETE FROM site_settings WHERE key IN ('footer_brand_name', 'footer_brand_description');
