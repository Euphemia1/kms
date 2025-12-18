import { query, queryOne, execute } from "@/lib/db"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  featured_image: string
  author_name: string
  published_at: string
  is_featured: boolean
  views: number
}

async function getArticle(slug: string) {
  const article = await queryOne<NewsArticle>("SELECT * FROM news WHERE slug = ? AND is_published = TRUE", [slug])
  return article
}

async function getRelatedArticles(category: string, currentId: string) {
  const articles = await query<NewsArticle>(
    "SELECT * FROM news WHERE category = ? AND is_published = TRUE AND id != ? ORDER BY published_at DESC LIMIT 3",
    [category, currentId],
  )
  return articles
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.category, article.id)

  // Increment view count
  await execute("UPDATE news SET views = views + 1 WHERE id = ?", [article.id])

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Article Header */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation>
              <Button variant="ghost" asChild className="mb-6">
                <Link href="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to News
                </Link>
              </Button>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary">{article.category}</Badge>
                {article.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author_name}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>{article.views || 0} views</span>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.featured_image && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="max-w-5xl mx-auto">
              <img
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                className="w-full aspect-[21/9] object-cover rounded-2xl"
              />
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <ScrollAnimation className="max-w-3xl mx-auto">
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">{article.excerpt}</p>
            )}

            <div className="prose prose-lg max-w-none">
              {article.content?.split("\n").map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 text-foreground/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <span className="text-muted-foreground">Share this article</span>
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Related Articles</h2>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedArticles.map((related, index) => (
                <ScrollAnimation key={related.id} delay={index * 100}>
                  <Link href={`/news/${related.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={related.featured_image || "/placeholder.svg?height=200&width=400&query=news"}
                        alt={related.title}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(related.published_at).toLocaleDateString()}
                    </p>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
