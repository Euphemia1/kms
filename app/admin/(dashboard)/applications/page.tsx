
export const dynamic = "force-dynamic";
import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, FileText, ExternalLink } from "lucide-react"
import { ApplicationStatusUpdate } from "@/components/admin/application-status-update"
import { Button } from "@/components/ui/button"

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  job_title: string
  cover_letter: string
  resume_url: string
  status: string
  notes: string
  created_at: string
}

async function getApplications() {
  const applications = await query<Application>("SELECT * FROM job_applications ORDER BY created_at DESC")
  return applications
}

export default async function ApplicationsPage() {
  const applications = await getApplications()

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    reviewing: "bg-blue-100 text-blue-700 border-blue-200",
    shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
    interviewed: "bg-indigo-100 text-indigo-700 border-indigo-200",
    hired: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-muted-foreground">Review and manage job applications</p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className={app.status === "pending" ? "border-l-4 border-l-yellow-500" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.full_name}</CardTitle>
                    <CardDescription>Applied for: {app.job_title}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[app.status]}>{app.status}</Badge>
                    <ApplicationStatusUpdate applicationId={app.id} currentStatus={app.status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {app.email}
                  </span>
                  {app.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {app.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(app.created_at).toLocaleString()}
                  </span>
                </div>
                {app.resume_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                )}
                {app.cover_letter && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Cover Letter:</p>
                    <p className="text-sm whitespace-pre-wrap">{app.cover_letter}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
