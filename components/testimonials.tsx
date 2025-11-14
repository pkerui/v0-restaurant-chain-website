import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink } from "lucide-react"

interface Testimonial {
  id: number | string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  title?: string
  showLimit?: number
  showMoreButton?: boolean
  moreButtonUrl?: string
}

export default function Testimonials({
  testimonials,
  title = "顾客评价",
  showLimit,
  showMoreButton = false,
  moreButtonUrl
}: TestimonialsProps) {
  const displayedTestimonials = showLimit ? testimonials.slice(0, showLimit) : testimonials

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-balance">{title}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          来自我们顾客的真实评价，每一句都是我们坚持的动力
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow border border-border">
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* More Button */}
        {showMoreButton && moreButtonUrl && (
          <div className="text-center mt-12">
            <p className="text-foreground text-lg mb-4 max-w-2xl mx-auto font-medium">
              想看更多真实评价？访问大众点评，查看数千条来自真实顾客的评价和门店照片
            </p>
            <a
              href={moreButtonUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <ExternalLink className="w-4 h-4 mr-2" />
                访问大众点评
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
