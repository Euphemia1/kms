"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, CheckCircle } from "lucide-react"

interface Job {
  id: string
  title: string
}

export function ApplicationForm({ jobs }: { jobs: Job[] }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_id: "",
    job_title: "",
    cover_letter: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handleSelectJob = (e: CustomEvent<string>) => {
      const selectedJob = jobs.find((j) => j.title === e.detail)
      if (selectedJob) {
        setFormData((prev) => ({
          ...prev,
          job_id: selectedJob.id,
          job_title: selectedJob.title,
        }))
      }
    }

    window.addEventListener("selectJob", handleSelectJob as EventListener)
    return () => window.removeEventListener("selectJob", handleSelectJob as EventListener)
  }, [jobs])

  const handleJobChange = (jobId: string) => {
    const selectedJob = jobs.find((j) => j.id === jobId)
    setFormData((prev) => ({
      ...prev,
      job_id: jobId,
      job_title: selectedJob?.title || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("job_id", formData.job_id || "")
      formDataToSend.append("job_title", formData.job_title || "General Application")
      formDataToSend.append("full_name", formData.full_name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("cover_letter", formData.cover_letter)
      
      if (file) {
        formDataToSend.append("resume", file)
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        body: formDataToSend,
      })

      if (!res.ok) throw new Error("Failed to submit")

      setSubmitted(true)
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        job_id: "",
        job_title: "",
        cover_letter: "",
      })
      setFile(null)
      setFileName("")
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="application-form" className="py-20 bg-foreground text-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Application Submitted!</h2>
            <p className="text-background/70 mb-8">
              Thank you for your interest in joining KMS SARL. We will review your application and get back to you
              within 5 business days.
            </p>
            <Button variant="secondary" onClick={() => setSubmitted(false)} className="rounded-full">
              Submit Another Application
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="application-form" className="py-20 bg-foreground text-background scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollAnimation className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Apply Now</h2>
            <p className="text-background/70 mt-4">
              Submit your application and we'll get back to you within 5 business days.
            </p>
          </ScrollAnimation>

          <ScrollAnimation>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-background">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-background">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-background">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                    placeholder="+243 123 456 789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-background">
                    Position Applied For
                  </Label>
                  <Select value={formData.job_id} onValueChange={handleJobChange}>
                    <SelectTrigger className="bg-background/10 border-background/20 text-background">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Application</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_letter" className="text-background">
                  Cover Letter / Additional Information
                </Label>
                <Textarea
                  id="cover_letter"
                  value={formData.cover_letter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cover_letter: e.target.value }))}
                  rows={5}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                  placeholder="Tell us about yourself and why you'd be a great fit..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-background">Resume / CV</Label>
                <div 
                  className="border-2 border-dashed border-background/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/10"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <Upload className="w-10 h-10 mx-auto mb-4 text-background/50" />
                  <p className="text-background/70 text-sm">{fileName || 'Drag and drop your resume here, or click to browse'}</p>
                  <p className="text-background/50 text-xs mt-2">PDF, DOC, or DOCX (max 5MB)</p>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0]
                      if (selectedFile) {
                        setFile(selectedFile)
                        setFileName(selectedFile.name)
                      }
                    }}
                    aria-label="Upload resume file"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
