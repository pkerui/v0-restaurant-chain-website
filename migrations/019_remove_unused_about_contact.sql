-- 删除关于页面中未使用的联系信息设置
-- 这些信息在独立的联系页面中管理，关于页面不需要显示

DELETE FROM site_settings
WHERE key IN (
  'about_contact_email',
  'about_contact_phone',
  'about_contact_address'
);

-- 验证删除结果
SELECT COUNT(*) as deleted_count
FROM site_settings
WHERE page = 'about'
AND key LIKE 'about_contact_%';

-- 显示剩余的关于页面设置
SELECT key, description
FROM site_settings
WHERE page = 'about'
ORDER BY key;
