import { query } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, MapPin, Briefcase, Clock } from "lucide-react"
import Link from "next/link"
import { DeleteJobButton } from "@/components/admin/delete-job-button"

interface Job {
  id: string
  title: string
  description: string
  department: string
  location: string
  employment_type: string
  is_active: boolean
  created_at: string
}

async function getJobs() {
  const jobs = await query<Job>("SELECT * FROM job_postings ORDER BY created_at DESC")
  return jobs
}

export default async function CareersPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Careers</h1>
          <p className="text-muted-foreground">Manage job postings and openings</p>
        </div>
        <Button asChild>
          <Link href="/admin/careers/new">
            <Plus className="mr-2 h-4 w-4" />
            Post Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No job postings yet</p>
            <Button asChild>
              <Link href="/admin/careers/new">Create your first job posting</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                  </div>
                  <Badge variant={job.is_active ? "default" : "secondary"}>
                    {job.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.employment_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/careers/${job.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteJobButton jobId={job.id} jobTitle={job.title} />
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
