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
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Service {
  id?: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  sort_order: number
  is_active: boolean
  featured_video?: string | null
}

const defaultService: Service = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  icon: "Wrench",
  sort_order: 0,
  is_active: true,
  featured_video: null,
}

export function ServiceForm({ service }: { service?: Service }) {
  const [formData, setFormData] = useState<Service>(service || defaultService)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const method = service?.id ? "PUT" : "POST"
      const url = service?.id ? `/api/services/${service.id}` : "/api/services"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed to ${method === "POST" ? "create" : "update"} service`)
      }

      router.push("/admin/services")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{service?.id ? "Edit Service" : "Create New Service"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g. mechanical-maintenance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description *</Label>
            <Textarea
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea
              id="full_description"
              name="full_description"
              value={formData.full_description}
              onChange={handleChange}
              disabled={loading}
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wrench">Wrench (Maintenance)</SelectItem>
                  <SelectItem value="HardHat">Hard Hat (Construction)</SelectItem>
                  <SelectItem value="Truck">Truck (Logistics)</SelectItem>
                  <SelectItem value="Mountain">Mountain (Mining)</SelectItem>
                  <SelectItem value="Package">Package (Procurement)</SelectItem>
                  <SelectItem value="FileText">File Text (Consulting)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleNumberChange("sort_order", e.target.value)}
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="space-y-2">
            <Label>Featured Video</Label>
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
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              disabled={loading}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {service?.id ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {service?.id ? "Update Service" : "Create Service"}
            </>
          )}
        </Button>
        <Button variant="outline" type="button" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  )
}