
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  is_published: boolean
  published_at: string
  created_at: string
}

export async function GET() {
  try {
    const news = await query<NewsArticle>("SELECT * FROM news ORDER BY created_at DESC")
    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const newsId = uuidv4();
    await execute(
      `INSERT INTO news (id, title, slug, excerpt, content, category, featured_image, author_id, author_name, is_featured, is_published, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newsId,
        data.title,
        data.slug,
        data.excerpt || null,
        data.content || null,
        data.category,
        data.featured_image || null,
        session.user.id,
        session.user.full_name,
        data.is_featured ? 1 : 0,
        data.is_published ? 1 : 0,
        data.is_published ? new Date() : null,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  }
}
