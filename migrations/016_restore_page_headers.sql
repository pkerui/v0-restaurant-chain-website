-- 恢复页面Header设置（如果不存在）
-- 确保所有页面的标题和描述都可以在站点设置中编辑

-- 检查并插入关于页面设置
INSERT INTO site_settings (key, value, description, page)
SELECT 'about_page_title', '关于潮来', '关于页面标题', 'about'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'about_page_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'about_page_description', '传承三代的潮汕美食品牌', '关于页面描述', 'about'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'about_page_description');

-- 检查并插入联系页面设置
INSERT INTO site_settings (key, value, description, page)
SELECT 'contact_page_title', '联系我们', '联系页面标题', 'contact'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'contact_page_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'contact_page_description', '我们期待听到您的声音', '联系页面描述', 'contact'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'contact_page_description');

-- 检查并插入加盟页面设置
INSERT INTO site_settings (key, value, description, page)
SELECT 'franchise_page_title', '加盟潮来', '加盟页面标题', 'franchise'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'franchise_page_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'franchise_page_description', '加入我们的行列，成为潮来的合作伙伴，共同开创美食事业新局面', '加盟页面描述', 'franchise'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'franchise_page_description');

INSERT INTO site_settings (key, value, description, page)
SELECT 'franchise_form_title', '立即申请', '申请表单标题', 'franchise'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'franchise_form_title');

INSERT INTO site_settings (key, value, description, page)
SELECT 'franchise_form_description', '填写下方表格，我们将在24小时内与您联系', '申请表单描述', 'franchise'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'franchise_form_description');

-- 验证插入结果
SELECT key, value, page
FROM site_settings
WHERE page IN ('about', 'contact', 'franchise')
ORDER BY page, key;
