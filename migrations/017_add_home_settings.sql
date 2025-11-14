-- 添加首页设置
-- 使首页的所有文字都可以在站点设置中编辑

-- Hero Section
INSERT INTO site_settings (key, value, description, page)
SELECT 'home_hero_title', '潮来', '首页大标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_hero_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_hero_subtitle', '正宗潮汕牛肉粿粉', '首页副标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_hero_subtitle');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_hero_description', '三代美食传承 · 诚邀加盟合伙人', '首页描述', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_hero_description');

-- Why Section
INSERT INTO site_settings (key, value, description, page)
SELECT 'home_why_title', '为什么选择潮来', '首页特色标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_why_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_why_description', '我们坚持传统工艺与现代经营相结合，为顾客提供最地道的潮汕美食体验', '首页特色描述', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_why_description');

-- Feature 1
INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_1_title', '地道食材', '特色1 - 标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_1_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_1_description', '精选汕头当地牛肉，每日新鲜采购，保证品质', '特色1 - 描述', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_1_description');

-- Feature 2
INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_2_title', '传统手艺', '特色2 - 标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_2_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_2_description', '传承三代的烹饪工艺，每一碗都是用心之作', '特色2 - 描述', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_2_description');

-- Feature 3
INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_3_title', '顾客满意', '特色3 - 标题', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_3_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'home_feature_3_description', '连年获得好评，成为顾客的美食首选', '特色3 - 描述', 'home'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'home_feature_3_description');

-- 验证插入结果
SELECT key, value, description
FROM site_settings
WHERE page = 'home'
ORDER BY key;

SELECT '首页设置已添加，共' || COUNT(*) || '项' as result
FROM site_settings
WHERE page = 'home';
