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
import { Loader2, Save, ArrowLeft, X } from "lucide-react"
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
  featured_images?: string[] | null
}

const defaultService: Service = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  icon: "Wrench",
  sort_order: 0,
  is_active: true,
  featured_images: null,
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

          {/* Image Gallery Section */}
          <div className="space-y-2">
            <Label>Featured Images</Label>
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">Upload Images</Label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                  onClick={() => document.getElementById('imageFileInput')?.click()}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      Click to upload images
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (Max 5MB each)
                    </p>
                  </div>
                  <input
                    id="imageFileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const newImages = Array.from(files).map(file => {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            setError('One or more images exceed 5MB limit');
                            return null;
                          }
                          return URL.createObjectURL(file);
                        }).filter(Boolean) as string[];
                        
                        setFormData(prev => ({
                          ...prev,
                          featured_images: [...(prev.featured_images || []), ...newImages]
                        }));
                      }
                    }}
                    aria-label="Upload featured images"
                  />
                </div>
              </div>
              
              {formData.featured_images && formData.featured_images.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.featured_images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Featured ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              featured_images: prev.featured_images?.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, featured_images: null }))}
                  >
                    Remove All Images
                  </Button>
                </div>
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