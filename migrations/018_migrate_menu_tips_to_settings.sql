-- 将用餐小贴士从独立表迁移到站点设置
-- 这样可以在站点设置中统一管理

-- 1. 将现有的活跃小贴士迁移到 site_settings
-- 只迁移 is_active = true 的小贴士
DO $$
DECLARE
  tip_record RECORD;
  tip_counter INTEGER := 1;
BEGIN
  FOR tip_record IN
    SELECT content, sort_order
    FROM menu_tips
    WHERE is_active = TRUE
    ORDER BY sort_order ASC
  LOOP
    -- 插入为 site_settings 条目
    INSERT INTO site_settings (key, value, description, page)
    VALUES (
      'menu_tips_' || tip_counter,
      tip_record.content,
      '用餐小贴士 ' || tip_counter,
      'menu'
    )
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value;

    tip_counter := tip_counter + 1;
  END LOOP;
END $$;

-- 2. 验证迁移结果
SELECT key, value, description
FROM site_settings
WHERE page = 'menu' AND key LIKE 'menu_tips_%'
ORDER BY key;

-- 注意：暂时保留 menu_tips 表，以便回滚
-- 如果确认迁移成功，可以手动删除：
-- DROP TABLE IF EXISTS menu_tips;
