import { queryOne } from "@/lib/db"
import { NewsForm } from "@/components/admin/news-form"
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
  is_featured: boolean
  is_published: boolean
  published_at: string
}

async function getArticle(id: string) {
  const article = await queryOne<NewsArticle>("SELECT * FROM news WHERE id = ?", [id])
  return article
}

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Article</h1>
        <p className="text-muted-foreground">Update article content</p>
      </div>
      <NewsForm article={article} />
    </div>
  )
}
