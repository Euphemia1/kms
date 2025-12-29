export const revalidate = 3600; // Revalidate every hour for production

import { query } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  featured_image: string
  author_name: string
  published_at: string
  is_featured: boolean
}

async function getNews() {
  const news = await query<NewsArticle>("SELECT * FROM news WHERE is_published = TRUE ORDER BY published_at DESC")
  return news
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">News & Updates</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              Latest <span className="text-primary">News</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Stay updated with the latest news, projects, and developments from KMS SARL.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <ScrollAnimation key={article.id} delay={index * 100}>
                  <Link href={`/news/${article.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <img
                        src={article.featured_image || "/placeholder.svg?height=300&width=500&query=news article"}
                        alt={article.title}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {article.is_featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {article.published_at ? new Date(article.published_at).toLocaleDateString() : "Draft"}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
