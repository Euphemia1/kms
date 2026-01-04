"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface JobPosting {
  id?: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  salary_range: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits?: string[]
  application_deadline?: string | null
  is_active: boolean
  featured_video?: string | null
}

const defaultJob: JobPosting = {
  title: "",
  slug: "",
  department: "",
  location: "Kolwezi, DRC",
  employment_type: "full-time",
  experience_level: "mid",
  salary_range: "",
  description: "",
  requirements: [""],
  responsibilities: [""],
  benefits: [""],
  is_active: true,
  featured_video: null,
}

export function JobForm({ job }: { job?: JobPosting }) {
  const [formData, setFormData] = useState<JobPosting>(() => {
    const baseData = job || defaultJob;
    return {
      ...baseData,
      benefits: baseData.benefits || [""]
    };
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isEditing = !!job?.id

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }))
  }

  const addListItem = (field: "requirements" | "responsibilities" | "benefits") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }))
  }

  const removeListItem = (field: "requirements" | "responsibilities" | "benefits", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

  const updateListItem = (field: "requirements" | "responsibilities" | "benefits", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dataToSave = {
        ...formData,
        requirements: formData.requirements.filter((r) => r.trim() !== ""),
        responsibilities: formData.responsibilities.filter((r) => r.trim() !== ""),
        benefits: formData.benefits?.filter((b) => b.trim() !== "") || [],
      }

      const url = isEditing ? `/api/jobs/${job.id}` : "/api/jobs"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save job")
      }

      router.push("/admin/careers")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/careers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="active" className="text-sm">
              Active
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Update" : "Post"} Job
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" value={formData.title} onChange={handleTitleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Requirements</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("requirements")}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateListItem("requirements", index, e.target.value)}
                      placeholder="Enter requirement..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeListItem("requirements", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Responsibilities</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("responsibilities")}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={resp}
                      onChange={(e) => updateListItem("responsibilities", index, e.target.value)}
                      placeholder="Enter responsibility..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeListItem("responsibilities", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Benefits</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addListItem("benefits")}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.benefits?.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateListItem("benefits", index, e.target.value)}
                      placeholder="Enter benefit..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeListItem("benefits", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, employment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary_range: e.target.value }))}
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Upload Video</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                    onClick={() => document.getElementById('videoFileInput')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        Click to upload video
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MP4, MOV, AVI (Max 50MB)
                      </p>
                    </div>
                    <input
                      id="videoFileInput"
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (max 50MB)
                          if (file.size > 50 * 1024 * 1024) {
                            setError('Video file size exceeds 50MB limit');
                            return;
                          }
                          
                          // Set the video file
                          setFormData((prev) => ({ ...prev, featured_video: URL.createObjectURL(file) }));
                        }
                      }}
                      aria-label="Upload featured video"
                    />
                  </div>
                </div>
                
                {formData.featured_video && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                    <video
                      src={formData.featured_video}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {formData.featured_video && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFormData((prev) => ({ ...prev, featured_video: null }))}
                  >
                    Remove Video
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
