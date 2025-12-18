import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Newspaper, Briefcase, MessageSquare, Users, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CountResult {
  count: number
}

async function getStats() {
  const [projects, news, activeJobs, unreadMessages, pendingApplications] = await Promise.all([
    query<CountResult>("SELECT COUNT(*) as count FROM projects"),
    query<CountResult>("SELECT COUNT(*) as count FROM news"),
    query<CountResult>("SELECT COUNT(*) as count FROM job_postings WHERE is_active = TRUE"),
    query<CountResult>("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'unread'"),
    query<CountResult>("SELECT COUNT(*) as count FROM job_applications WHERE status = 'pending'"),
  ])

  return {
    projects: projects[0]?.count || 0,
    news: news[0]?.count || 0,
    activeJobs: activeJobs[0]?.count || 0,
    unreadMessages: unreadMessages[0]?.count || 0,
    pendingApplications: pendingApplications[0]?.count || 0,
  }
}

interface Contact {
  id: string
  full_name: string
  subject: string
  created_at: string
  status: string
}

interface Application {
  id: string
  full_name: string
  job_title: string
  created_at: string
  status: string
}

async function getRecentActivity() {
  const [contacts, applications] = await Promise.all([
    query<Contact>("SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 5"),
    query<Application>("SELECT * FROM job_applications ORDER BY created_at DESC LIMIT 5"),
  ])

  return { contacts, applications }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const activity = await getRecentActivity()

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "News Articles",
      value: stats.news,
      icon: Newspaper,
      href: "/admin/news",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      href: "/admin/careers",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      href: "/admin/contacts",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: Users,
      href: "/admin/applications",
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your site.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/projects/new">New Project</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/news/new">New Article</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/contacts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activity.contacts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {activity.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.subject || "No subject"}</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <CardDescription>Latest job applications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activity.applications.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {activity.applications.map((app) => (
                  <div key={app.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.job_title}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        app.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/admin/projects/new">
                <FolderKanban className="h-5 w-5" />
                <span>Add New Project</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/admin/news/new">
                <Newspaper className="h-5 w-5" />
                <span>Write News Article</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/admin/careers/new">
                <Briefcase className="h-5 w-5" />
                <span>Post Job Opening</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
              <Link href="/admin/settings">
                <MessageSquare className="h-5 w-5" />
                <span>Site Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
