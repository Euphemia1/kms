export const dynamic = "force-dynamic";

import { query } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Eye, EyeOff, Calendar } from "lucide-react"
import Link from "next/link"
import { DeleteNewsButton } from "@/components/admin/delete-news-button"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  author_name: string
  is_published: boolean
  is_featured: boolean
  published_at: string
  created_at: string
  views: number
}

async function getNews() {
  const news = await query<NewsArticle>("SELECT * FROM news ORDER BY created_at DESC")
  return news
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News & Blog</h1>
          <p className="text-muted-foreground">Manage news articles and blog posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {news.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No articles yet</p>
            <Button asChild>
              <Link href="/admin/news/new">Write your first article</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {news.map((article) => (
            <Card key={article.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      {article.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </div>
                  <Badge variant={article.is_published ? "default" : "outline"}>
                    {article.is_published ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" /> Draft
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{article.category}</Badge>
                    <span>By {article.author_name || "Unknown"}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString()}
                    </span>
                    <span>{article.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/news/${article.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteNewsButton articleId={article.id} articleTitle={article.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
