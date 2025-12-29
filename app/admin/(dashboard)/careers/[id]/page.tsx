export const dynamic = "force-dynamic";

import { queryOne } from "@/lib/db"
import { JobForm } from "@/components/admin/job-form"
import { notFound } from "next/navigation"

interface JobPosting {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  salary_range: string
  description: string
  requirements: string | null
  responsibilities: string | null
  benefits: string | null
  application_deadline: string | null
  is_active: boolean
}

async function getJob(id: string) {
  const job = await queryOne<JobPosting>("SELECT * FROM job_postings WHERE id = ?", [id])
  if (job) {
    // Parse JSON fields, handling null values
    return {
      ...job,
      requirements: job.requirements && typeof job.requirements === "string" ? JSON.parse(job.requirements) : job.requirements || [],
      responsibilities:
        job.responsibilities && typeof job.responsibilities === "string" ? JSON.parse(job.responsibilities) : job.responsibilities || [],
      benefits:
        job.benefits && typeof job.benefits === "string" ? JSON.parse(job.benefits) : job.benefits || [],
    }
  }
  return null
}

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Job Posting</h1>
        <p className="text-muted-foreground">Update job details</p>
      </div>
      <JobForm job={job} />
    </div>
  )
}
