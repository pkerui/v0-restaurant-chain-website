-- 清理未使用的站点设置
-- 只删除页面中完全未使用的设置项

-- 删除评价页面设置（用户评价功能已删除）
DELETE FROM site_settings WHERE page = 'reviews';
-- 删除项: reviews_page_title, reviews_page_description, reviews_cta_title, reviews_cta_description

-- 注意：不要删除以下页面的设置，它们都在使用中：
-- ✅ home页面（11个）：home_hero_title, home_hero_subtitle, home_hero_description, home_why_title, home_why_description, home_feature_*
-- ✅ about页面（35个）：about_page_title, about_page_description + 所有about_*相关设置
-- ✅ contact页面（2个）：contact_page_title, contact_page_description
-- ✅ franchise页面（4个）：franchise_page_title, franchise_page_description, franchise_form_title, franchise_form_description
-- ✅ menu页面（3个）：menu_page_title, menu_page_description, menu_tips_title
-- ✅ stores页面（3个）：stores_page_title, stores_page_description, stores_map_title

-- 验证删除后剩余的设置
SELECT page, COUNT(*) as settings_count
FROM site_settings
GROUP BY page
ORDER BY page;

-- 显示剩余的所有设置（用于确认）
SELECT key, description, page
FROM site_settings
WHERE page IN ('home', 'about', 'contact', 'franchise', 'menu', 'stores')
ORDER BY page, key;
