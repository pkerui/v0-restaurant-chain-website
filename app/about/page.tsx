"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Leaf, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { SiteSetting } from "@/lib/supabase/types";

// 轮播图片数据 - 移到组件内部从数据库加载

export default function AboutPage() {
  // 轮播状态
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [carouselImages, setCarouselImages] = useState<Array<{ src: string; alt: string }>>([])

  // 站点设置（提供默认值作为后备）
  const [settings, setSettings] = useState<Record<string, string>>({
    // Header
    about_page_title: "关于潮来",
    about_page_description: "传承三代的潮汕美食品牌",
    // 我们的故事
    about_story_paragraph_1: "潮来源于对潮汕美食的执着与热爱。创始人李家是潮汕烹饪工艺的第三代传承人，从祖父开始就坚守手工制作的传统，用最简单的食材烹饪出最地道的风味。",
    about_story_paragraph_2: "2003年，带着对美食事业的憧憬，潮来在汕头市中心开设了第一家店铺。我们坚信，美食不仅是食物，更是文化的传承和情感的表达。每一碗粿粉，都承载着我们对顾客的关爱和对品质的承诺。",
    about_story_paragraph_3: "今天，潮来已经发展成拥有三家直营店的连锁品牌，日均服务数千名顾客。但我们从未改变初心——用最新鲜的食材，用最传统的手艺，为每位顾客献上最美的潮汕美食体验。",
    // 核心价值观
    about_value_1_title: "用心烹饪",
    about_value_1_description: "每一道菜都倾注我们对美食的热爱与执着，坚持手工制作，绝不妥协品质",
    about_value_2_title: "食材新鲜",
    about_value_2_description: "每日从汕头本地精选最优质的牛肉和食材，确保顾客享受最地道的潮汕风味",
    about_value_3_title: "团队专业",
    about_value_3_description: "拥有经验丰富的烹饪团队，传承三代美食工艺，代代相传的手艺与技巧",
    about_value_4_title: "品质保证",
    about_value_4_description: "多次获得美食评选大奖，连年被评为汕头最受欢迎的潮汕美食品牌",
    // 发展历程
    about_milestone_1_year: "2003年",
    about_milestone_1_title: "潮来成立",
    about_milestone_1_description: "创始人李家三代美食工艺的传承人创立潮来，以一家小店开始美食之旅",
    about_milestone_2_year: "2010年",
    about_milestone_2_title: "首家旗舰店",
    about_milestone_2_description: "开设中山路旗舰店，采用现代经营理念，将传统美食与舒适环境完美结合",
    about_milestone_3_year: "2015年",
    about_milestone_3_title: "连锁扩展",
    about_milestone_3_description: "发展为三家直营店，服务范围遍布汕头市中心，成为当地美食地标",
    about_milestone_4_year: "2020年",
    about_milestone_4_title: "数字化升级",
    about_milestone_4_description: "推出美团外卖服务，让更多顾客享受到潮来的美食，实现线上线下融合",
    about_milestone_5_year: "2024年",
    about_milestone_5_title: "品牌升级",
    about_milestone_5_description: "推出官方网站，启动加盟计划，准备将潮来美食品牌推向更广阔的舞台",
    // 团队
    about_team_description: "潮来拥有专业的团队成员，每一个岗位都有专业的人才在坚守。从烹饪大师到服务人员，我们所有人都为同一个目标而努力——为顾客呈现最好的美食和服务体验。",
    // 成就
    about_achievement_1_number: "20+",
    about_achievement_1_label: "年美食传承",
    about_achievement_2_number: "100K+",
    about_achievement_2_label: "满意顾客",
    about_achievement_3_number: "10+",
    about_achievement_3_label: "行业奖项"
  });

  // 核心价值观（从设置中动态生成）
  const values = [
    {
      icon: Heart,
      title: settings.about_value_1_title,
      description: settings.about_value_1_description,
    },
    {
      icon: Leaf,
      title: settings.about_value_2_title,
      description: settings.about_value_2_description,
    },
    {
      icon: Users,
      title: settings.about_value_3_title,
      description: settings.about_value_3_description,
    },
    {
      icon: Award,
      title: settings.about_value_4_title,
      description: settings.about_value_4_description,
    },
  ];

  // 发展历程（从设置中动态生成）
  const milestones = [
    {
      year: settings.about_milestone_1_year,
      title: settings.about_milestone_1_title,
      description: settings.about_milestone_1_description,
    },
    {
      year: settings.about_milestone_2_year,
      title: settings.about_milestone_2_title,
      description: settings.about_milestone_2_description,
    },
    {
      year: settings.about_milestone_3_year,
      title: settings.about_milestone_3_title,
      description: settings.about_milestone_3_description,
    },
    {
      year: settings.about_milestone_4_year,
      title: settings.about_milestone_4_title,
      description: settings.about_milestone_4_description,
    },
    {
      year: settings.about_milestone_5_year,
      title: settings.about_milestone_5_title,
      description: settings.about_milestone_5_description,
    },
  ];

  // 加载站点设置
  useEffect(() => {
    loadSettings();
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_gallery')
        .select('image_url, alt_text')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.warn('品牌风采图片表尚未创建，使用默认图片。请在 Supabase 中执行 migrations/005_brand_gallery.sql')
        throw error
      }

      if (data && data.length > 0) {
        setCarouselImages(data.map(img => ({
          src: img.image_url,
          alt: img.alt_text
        })))
      } else {
        // 如果表存在但没有数据，使用默认图片
        console.info('品牌风采图片表为空，使用默认图片')
        setCarouselImages([
          {
            src: "https://images.unsplash.com/photo-1555939594-58056f625634?w=800&h=500&fit=crop",
            alt: "地道潮汕牛肉粿汁",
          },
          {
            src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=500&fit=crop",
            alt: "中山路旗舰店",
          },
        ])
      }
    } catch (error) {
      console.error('加载品牌风采图片失败:', error)
      // 如果加载失败，使用默认图片
      setCarouselImages([
        {
          src: "https://images.unsplash.com/photo-1555939594-58056f625634?w=800&h=500&fit=crop",
          alt: "地道潮汕牛肉粿汁",
        },
        {
          src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=500&fit=crop",
          alt: "中山路旗舰店",
        },
      ])
    }
  }

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('page', 'about');

      if (error) throw error;

      if (data) {
        const settingsObj: Record<string, string> = {};
        data.forEach((setting: SiteSetting) => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  // 新增：轮播逻辑
  useEffect(() => {
    if (!isAutoPlay || carouselImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // 3秒切换
    return () => clearInterval(interval);
  }, [isAutoPlay, carouselImages.length]);

  // 新增：手动切换
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false); // 点击暂停自动播放
  };

  // 原动画变体（未变）
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{settings.about_page_title}</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">{settings.about_page_description}</p>
        </div>
      </section>
      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Our Story - 未变 */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">我们的故事</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-secondary/20 rounded-lg p-8 md:p-12 border border-border"
            >
              <p className="text-lg text-foreground leading-relaxed mb-4">
                {settings.about_story_paragraph_1}
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                {settings.about_story_paragraph_2}
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                {settings.about_story_paragraph_3}
              </p>
            </motion.div>
          </div>
          {/* Core Values - 未变 */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">核心价值观</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="p-6 text-center hover:shadow-lg transition-shadow border border-border">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          {/* Timeline - 未变 */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">发展历程</h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {milestones.map((milestone, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                    {index !== milestones.length - 1 && <div className="w-1 h-24 bg-border mt-4" />}
                  </div>
                  <div className="pb-8">
                    <div className="text-sm font-bold text-primary mb-1">{milestone.year}</div>
                    <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          {/* Team */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">我们的团队</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-secondary/20 rounded-lg p-8 md:p-12 border border-border mb-8"
            >
              <p className="text-lg text-foreground leading-relaxed text-center">
                {settings.about_team_description}
              </p>
            </motion.div>
          </div>
          {/* Achievement */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 md:p-12 border border-border text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-balance">我们的成就</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{settings.about_achievement_1_number}</p>
                  <p className="text-muted-foreground">{settings.about_achievement_1_label}</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{settings.about_achievement_2_number}</p>
                  <p className="text-muted-foreground">{settings.about_achievement_2_label}</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{settings.about_achievement_3_number}</p>
                  <p className="text-muted-foreground">{settings.about_achievement_3_label}</p>
                </div>
              </div>
            </motion.div>
          </div>
          {/* 新增：品牌风采 - 图片轮播 */}
          {carouselImages.length > 0 && (
            <div className="mb-20">
              <motion.h2 // 新增：标题动画
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance"
              >
                品牌风采
              </motion.h2>
              <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg"> {/* 新增：轮播容器 */}
                <AnimatePresence mode="wait"> {/* 新增：AnimatePresence 用于切换动画 */}
                  {carouselImages[currentIndex] && (
                    <motion.img
                      key={currentIndex}
                      src={carouselImages[currentIndex].src}
                      alt={carouselImages[currentIndex].alt}
                      className="w-full aspect-[4/3] object-cover" // 4:3 比例
                      initial={{ x: 100 }} // 从右滑入
                      animate={{ x: 0 }}
                      exit={{ x: -100 }} // 向左滑出
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>
              {/* 新增：箭头控制 */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              {/* 新增：指示点 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-background/50"
                    }`}
                  />
                ))}
              </div>
              {/* 新增：图片标题叠加 */}
              {carouselImages[currentIndex] && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
                  <p className="font-semibold">{carouselImages[currentIndex].alt}</p>
                </div>
              )}
            </div>
            {/* 新增：暂停/播放按钮（可选） */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
              >
                {isAutoPlay ? "暂停自动播放" : "启动自动播放"}
              </Button>
            </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
