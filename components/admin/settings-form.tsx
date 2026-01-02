"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

interface SettingsFormProps {
  settings: Record<string, string>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState(settings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic company details displayed across the site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name || ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_tagline">Tagline</Label>
              <Input
                id="company_tagline"
                value={formData.company_tagline || ""}
                onChange={(e) => handleChange("company_tagline", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_email">Email</Label>
              <Input
                id="company_email"
                type="email"
                value={formData.company_email || ""}
                onChange={(e) => handleChange("company_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_phone">Phone</Label>
              <Input
                id="company_phone"
                value={formData.company_phone || ""}
                onChange={(e) => handleChange("company_phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_address">Address</Label>
              <Textarea
                id="company_address"
                value={formData.company_address || ""}
                onChange={(e) => handleChange("company_address", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Content</CardTitle>
            <CardDescription>Hero section and main messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title || ""}
                onChange={(e) => handleChange("hero_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={formData.hero_subtitle || ""}
                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_short">About (Short)</Label>
              <Textarea
                id="about_short"
                value={formData.about_short || ""}
                onChange={(e) => handleChange("about_short", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Numbers displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience || ""}
                  onChange={(e) => handleChange("years_experience", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projects_completed">Projects Completed</Label>
                <Input
                  id="projects_completed"
                  type="number"
                  value={formData.projects_completed || ""}
                  onChange={(e) => handleChange("projects_completed", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={formData.team_size || ""}
                  onChange={(e) => handleChange("team_size", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clients_served">Clients Served</Label>
                <Input
                  id="clients_served"
                  type="number"
                  value={formData.clients_served || ""}
                  onChange={(e) => handleChange("clients_served", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
