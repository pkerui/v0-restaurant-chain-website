-- 创建加盟内容管理表

-- 1. 加盟优势表
CREATE TABLE IF NOT EXISTS franchise_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon TEXT NOT NULL, -- 图标名称 (如: Award, TrendingUp, Users, CheckCircle2)
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 加盟条件表
CREATE TABLE IF NOT EXISTS franchise_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 加盟流程表
CREATE TABLE IF NOT EXISTS franchise_process (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认数据

-- 加盟优势
INSERT INTO franchise_benefits (icon, title, description, sort_order) VALUES
  ('Award', '品牌力量', '拥有多年口碑积累的潮汕美食品牌，知名度高', 1),
  ('TrendingUp', '盈利模式', '成熟的商业模式，快速实现投资回报', 2),
  ('Users', '团队支持', '完善的培训体系和全程运营指导', 3),
  ('CheckCircle2', '供应保障', '统一的食材采购和质量标准控制', 4)
ON CONFLICT DO NOTHING;

-- 加盟条件
INSERT INTO franchise_requirements (content, sort_order) VALUES
  ('热爱美食行业，具有餐饮业经营经验优先', 1),
  ('有一定的资金实力和风险承受能力', 2),
  ('认同潮来品牌文化和经营理念', 3),
  ('具有良好的商业信誉和社会声誉', 4),
  ('能够按照总部要求执行经营方案', 5),
  ('承诺投入足够的时间和精力', 6)
ON CONFLICT DO NOTHING;

-- 加盟流程
INSERT INTO franchise_process (step_number, title, description, sort_order) VALUES
  (1, '提交申请', '填写申请表格', 1),
  (2, '资格审核', '我们审核评估', 2),
  (3, '深入洽谈', '了解详细方案', 3),
  (4, '正式合作', '签订合同开业', 4)
ON CONFLICT DO NOTHING;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_franchise_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER franchise_benefits_updated_at
  BEFORE UPDATE ON franchise_benefits
  FOR EACH ROW
  EXECUTE FUNCTION update_franchise_content_updated_at();

CREATE TRIGGER franchise_requirements_updated_at
  BEFORE UPDATE ON franchise_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_franchise_content_updated_at();

CREATE TRIGGER franchise_process_updated_at
  BEFORE UPDATE ON franchise_process
  FOR EACH ROW
  EXECUTE FUNCTION update_franchise_content_updated_at();

-- 设置 RLS 策略
ALTER TABLE franchise_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_process ENABLE ROW LEVEL SECURITY;

-- 公开访问激活的内容
CREATE POLICY "公开查看激活的加盟优势"
  ON franchise_benefits FOR SELECT TO public
  USING (is_active = TRUE);

CREATE POLICY "公开查看激活的加盟条件"
  ON franchise_requirements FOR SELECT TO public
  USING (is_active = TRUE);

CREATE POLICY "公开查看激活的加盟流程"
  ON franchise_process FOR SELECT TO public
  USING (is_active = TRUE);

-- 管理员完全访问权限
CREATE POLICY "管理员完全访问加盟优势"
  ON franchise_benefits FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "管理员完全访问加盟条件"
  ON franchise_requirements FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "管理员完全访问加盟流程"
  ON franchise_process FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
