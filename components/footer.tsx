import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
                <span className="text-foreground font-bold">潮</span>
              </div>
              潮来
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              正宗潮汕牛肉粿粉，传承三代美食工艺。我们用心为每位顾客奉献地道的潮汕美食。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "关于我们" },
                { href: "/menu", label: "菜单" },
                { href: "/stores", label: "门店位置" },
                { href: "/reviews", label: "顾客评价" },
                { href: "/franchise", label: "加盟合作" },
                { href: "/contact", label: "联系我们" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-80 hover:opacity-100 transition-opacity">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">联系方式</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <a href="tel:400-xxxx-xxxx">400-XXXX-XXXX</a>
              </li>
              <li className="flex items-start gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <a href="mailto:service@chaolai.com">service@chaolai.com</a>
              </li>
              <li className="flex items-start gap-2 opacity-80">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>广东省汕头市</span>
              </li>
              <li className="flex items-start gap-2 opacity-80">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>10:00-22:00</span>
              </li>
            </ul>
          </div>

          {/* Delivery */}
          <div>
            <h4 className="font-semibold mb-4">在线订餐</h4>
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              在美团外卖平台找到我们，享受便捷配送服务，美食到家。
            </p>
            <a
              href="https://waimai.meituan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-background text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              美团外卖
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-background/20 pt-8">
          <p className="text-sm opacity-60 text-center">&copy; {currentYear} 潮来美食连锁. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
}
