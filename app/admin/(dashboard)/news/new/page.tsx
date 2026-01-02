import { NewsForm } from "@/components/admin/news-form"

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Article</h1>
        <p className="text-muted-foreground">Create a new news article or blog post</p>
      </div>
      <NewsForm />
    </div>
  )
}
