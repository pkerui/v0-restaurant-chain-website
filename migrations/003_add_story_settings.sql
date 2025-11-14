-- 添加"关于我们"页面所有可编辑内容
-- 执行此脚本为关于页面添加所有可编辑的设置项

INSERT INTO site_settings (key, value, description, page) VALUES
  -- 我们的故事（3段）
  ('about_story_paragraph_1',
   '潮来源于对潮汕美食的执着与热爱。创始人李家是潮汕烹饪工艺的第三代传承人，从祖父开始就坚守手工制作的传统，用最简单的食材烹饪出最地道的风味。',
   '我们的故事 - 第一段',
   'about'),
  ('about_story_paragraph_2',
   '2003年，带着对美食事业的憧憬，潮来在汕头市中心开设了第一家店铺。我们坚信，美食不仅是食物，更是文化的传承和情感的表达。每一碗粿粉，都承载着我们对顾客的关爱和对品质的承诺。',
   '我们的故事 - 第二段',
   'about'),
  ('about_story_paragraph_3',
   '今天，潮来已经发展成拥有三家直营店的连锁品牌，日均服务数千名顾客。但我们从未改变初心——用最新鲜的食材，用最传统的手艺，为每位顾客献上最美的潮汕美食体验。',
   '我们的故事 - 第三段',
   'about'),

  -- 核心价值观（4个价值观，每个2个字段）
  ('about_value_1_title', '用心烹饪', '核心价值观1 - 标题', 'about'),
  ('about_value_1_description', '每一道菜都倾注我们对美食的热爱与执着，坚持手工制作，绝不妥协品质', '核心价值观1 - 描述', 'about'),
  ('about_value_2_title', '食材新鲜', '核心价值观2 - 标题', 'about'),
  ('about_value_2_description', '每日从汕头本地精选最优质的牛肉和食材，确保顾客享受最地道的潮汕风味', '核心价值观2 - 描述', 'about'),
  ('about_value_3_title', '团队专业', '核心价值观3 - 标题', 'about'),
  ('about_value_3_description', '拥有经验丰富的烹饪团队，传承三代美食工艺，代代相传的手艺与技巧', '核心价值观3 - 描述', 'about'),
  ('about_value_4_title', '品质保证', '核心价值观4 - 标题', 'about'),
  ('about_value_4_description', '多次获得美食评选大奖，连年被评为汕头最受欢迎的潮汕美食品牌', '核心价值观4 - 描述', 'about'),

  -- 发展历程（5个里程碑，每个3个字段）
  ('about_milestone_1_year', '2003年', '里程碑1 - 年份', 'about'),
  ('about_milestone_1_title', '潮来成立', '里程碑1 - 标题', 'about'),
  ('about_milestone_1_description', '创始人李家三代美食工艺的传承人创立潮来，以一家小店开始美食之旅', '里程碑1 - 描述', 'about'),
  ('about_milestone_2_year', '2010年', '里程碑2 - 年份', 'about'),
  ('about_milestone_2_title', '首家旗舰店', '里程碑2 - 标题', 'about'),
  ('about_milestone_2_description', '开设中山路旗舰店，采用现代经营理念，将传统美食与舒适环境完美结合', '里程碑2 - 描述', 'about'),
  ('about_milestone_3_year', '2015年', '里程碑3 - 年份', 'about'),
  ('about_milestone_3_title', '连锁扩展', '里程碑3 - 标题', 'about'),
  ('about_milestone_3_description', '发展为三家直营店，服务范围遍布汕头市中心，成为当地美食地标', '里程碑3 - 描述', 'about'),
  ('about_milestone_4_year', '2020年', '里程碑4 - 年份', 'about'),
  ('about_milestone_4_title', '数字化升级', '里程碑4 - 标题', 'about'),
  ('about_milestone_4_description', '推出美团外卖服务，让更多顾客享受到潮来的美食，实现线上线下融合', '里程碑4 - 描述', 'about'),
  ('about_milestone_5_year', '2024年', '里程碑5 - 年份', 'about'),
  ('about_milestone_5_title', '品牌升级', '里程碑5 - 标题', 'about'),
  ('about_milestone_5_description', '推出官方网站，启动加盟计划，准备将潮来美食品牌推向更广阔的舞台', '里程碑5 - 描述', 'about'),

  -- 我们的团队
  ('about_team_description',
   '潮来拥有专业的团队成员，每一个岗位都有专业的人才在坚守。从烹饪大师到服务人员，我们所有人都为同一个目标而努力——为顾客呈现最好的美食和服务体验。',
   '团队介绍',
   'about'),

  -- 我们的成就（3个成就，每个2个字段）
  ('about_achievement_1_number', '20+', '成就1 - 数字', 'about'),
  ('about_achievement_1_label', '年美食传承', '成就1 - 标签', 'about'),
  ('about_achievement_2_number', '100K+', '成就2 - 数字', 'about'),
  ('about_achievement_2_label', '满意顾客', '成就2 - 标签', 'about'),
  ('about_achievement_3_number', '10+', '成就3 - 数字', 'about'),
  ('about_achievement_3_label', '行业奖项', '成就3 - 标签', 'about'),

  -- 联系我们
  ('about_contact_email', 'chaolai@email.com', '联系邮箱', 'about'),
  ('about_contact_phone', '+86 0754-12345678', '联系电话', 'about'),
  ('about_contact_address', '汕头市中山路188号', '联系地址', 'about');

-- 验证插入
SELECT COUNT(*) as total_about_settings FROM site_settings WHERE page = 'about';
