-- 创建图片存储桶
-- 用于存储品牌风采、菜单、门店等图片

-- 创建公共存储桶 'images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 设置存储策略：任何人可以查看，只有认证用户可以上传
-- 注意：Storage policies 需要比较简单，不能做复杂的子查询

-- 任何人可以查看（SELECT）
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 认证用户可以上传（INSERT）
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 认证用户可以更新自己上传的文件（UPDATE）
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);

-- 认证用户可以删除自己上传的文件（DELETE）
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);

-- 验证创建
SELECT * FROM storage.buckets WHERE id = 'images';
