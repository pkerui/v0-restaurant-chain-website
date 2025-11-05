"use client";

import { useState, useEffect } from "react"; // 新增：useEffect 用于自动播放
import { motion, AnimatePresence } from "framer-motion"; // 已用，现增强
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Award, Users, Leaf, Heart, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"; // 新增：箭头图标

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const formSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("邮箱格式无效"),
  message: z.string().min(10, "消息至少10字"),
});

// 新增：轮播图片数据（替换为你的真实图片）
const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1555939594-58056f625634?w=800&h=500&fit=crop", // 牛肉饭
    alt: "地道潮汕牛肉粿汁",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=500&fit=crop", // 门店
    alt: "中山路旗舰店",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3137?w=800&h=500&fit=crop", // 团队
    alt: "专业烹饪团队",
  },
  {
    src: "https://images.unsplash.com/photo-1574651351432-30f9a1e7e2f0?w=800&h=500&fit=crop", // 食材
    alt: "新鲜食材选购",
  },
];

export default function AboutPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 新增：轮播状态
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true); // 自动播放开关

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
  });

  const values = [
    // ... (原 values 数组，未变)
    {
      icon: Heart,
      title: "用心烹饪",
      description: "每一道菜都倾注我们对美食的热爱与执着，坚持手工制作，绝不妥协品质",
    },
    {
      icon: Leaf,
      title: "食材新鲜",
      description: "每日从汕头本地精选最优质的牛肉和食材，确保顾客享受最地道的潮汕风味",
    },
    {
      icon: Users,
      title: "团队专业",
      description: "拥有经验丰富的烹饪团队，传承三代美食工艺，代代相传的手艺与技巧",
    },
    {
      icon: Award,
      title: "品质保证",
      description: "多次获得美食评选大奖，连年被评为汕头最受欢迎的潮汕美食品牌",
    },
  ];

  const milestones = [
    // ... (原 milestones 数组，未变)
    {
      year: "2003年",
      title: "潮来成立",
      description: "创始人李家三代美食工艺的传承人创立潮来，以一家小店开始美食之旅",
    },
    {
      year: "2010年",
      title: "首家旗舰店",
      description: "开设中山路旗舰店，采用现代经营理念，将传统美食与舒适环境完美结合",
    },
    {
      year: "2015年",
      title: "连锁扩展",
      description: "发展为三家直营店，服务范围遍布汕头市中心，成为当地美食地标",
    },
    {
      year: "2020年",
      title: "数字化升级",
      description: "推出美团外卖服务，让更多顾客享受到潮来的美食，实现线上线下融合",
    },
    {
      year: "2024年",
      title: "品牌升级",
      description: "推出官方网站，启动加盟计划，准备将潮来美食品牌推向更广阔的舞台",
    },
  ];

  const teamRoles = [
    // ... (原 teamRoles 数组，未变)
    { icon: "👨‍🍳", title: "烹饪大师", count: 3 },
    { icon: "👨‍🔧", title: "食材采购", count: 5 },
    { icon: "🧑‍💼", title: "店铺管理", count: 6 },
    { icon: "🤝", title: "顾客服务", count: 12 },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("loading");
    try {
      console.log("提交数据：", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
      setErrorMsg("提交失败，请重试");
    }
  };

  // 新增：轮播逻辑
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // 3秒切换
    return () => clearInterval(interval);
  }, [isAutoPlay]);

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
      {/* Header Section - 未变 */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">关于潮来</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">三代美食传承，坚守品质承诺，为您献上最地道的潮汕美食</p>
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
                潮来源于对潮汕美食的执着与热爱。创始人李家是潮汕烹饪工艺的第三代传承人，从祖父开始就坚守手工制作的传统，用最简单的食材烹饪出最地道的风味。
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                2003年，带着对美食事业的憧憬，潮来在汕头市中心开设了第一家店铺。我们坚信，美食不仅是食物，更是文化的传承和情感的表达。每一碗粿粉，都承载着我们对顾客的关爱和对品质的承诺。
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                今天，潮来已经发展成拥有三家直营店的连锁品牌，日均服务数千名顾客。但我们从未改变初心——用最新鲜的食材，用最传统的手艺，为每位顾客献上最美的潮汕美食体验。
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
          {/* Team - 未变 */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">我们的团队</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-secondary/20 rounded-lg p-8 md:p-12 border border-border mb-8"
            >
              <p className="text-lg text-foreground leading-relaxed text-center mb-8">
                潮来拥有26名专业的团队成员，每一个岗位都有专业的人才在坚守。从烹饪大师到服务人员，我们所有人都为同一个目标而努力——为顾客呈现最好的美食和服务体验。
              </p>
              <div className="grid md:grid-cols-4 gap-6">
                {teamRoles.map((role, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} className="text-center cursor-pointer">
                    <div className="text-5xl mb-3">{role.icon}</div>
                    <h4 className="font-semibold mb-1">{role.title}</h4>
                    <p className="text-2xl font-bold text-primary">{role.count}人</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Achievement - 未变 */}
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
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">20+</p>
                  <p className="text-muted-foreground">年美食传承</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-accent mb-2">100K+</p>
                  <p className="text-muted-foreground">满意顾客</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</p>
                  <p className="text-muted-foreground">行业奖项</p>
                </div>
              </div>
            </motion.div>
          </div>
          {/* 新增：品牌风采 - 图片轮播 */}
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
                <motion.img
                  key={currentIndex}
                  src={carouselImages[currentIndex].src}
                  alt={carouselImages[currentIndex].alt}
                  className="w-full h-64 md:h-80 object-cover" // 响应式高度
                  initial={{ x: 100 }} // 从右滑入
                  animate={{ x: 0 }}
                  exit={{ x: -100 }} // 向左滑出
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
                <p className="font-semibold">{carouselImages[currentIndex].alt}</p>
              </div>
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
          {/* 联系我们 - 未变 */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">联系我们</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>chao lai@email.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+86 0754-12345678</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>汕头市中山路188号</span>
                </div>
              </div>
              <Card className="p-6 border-border">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      {...register("name")}
                      placeholder="您的姓名"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="您的邮箱"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Textarea
                      {...register("message")}
                      placeholder="您的消息..."
                      rows={4}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" disabled={submitStatus === "loading"} className="w-full">
                    {submitStatus === "loading" ? "发送中..." : "发送消息"}
                  </Button>
                </form>
                {submitStatus === "success" && (
                  <Alert className="mt-4">
                    <AlertDescription>消息发送成功！我们会尽快回复您。</AlertDescription>
                  </Alert>
                )}
                {submitStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
