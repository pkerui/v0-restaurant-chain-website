-- 检查 stores 表的列类型
SELECT
    column_name,
    data_type,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_name = 'stores'
AND column_name IN ('latitude', 'longitude');
