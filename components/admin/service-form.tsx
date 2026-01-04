"use client"

import React, { useState } from "react"
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
  featured_image?: string | null
  gallery_images?: string[] | null
  features?: string[] | null
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

const defaultService: Service = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  icon: "Wrench",
  featured_image: null,
  gallery_images: null,
  features: [],
  sort_order: 0,
  is_active: true,
}

export function ServiceForm({ service }: { service?: Service }) {
  const [formData, setFormData] = useState<Service>(service || defaultService)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const router = useRouter()

  const isEditing = !!service?.id
  
  // Initialize gallery previews when editing a service
  React.useEffect(() => {
    if (isEditing && service?.gallery_images && service.gallery_images.length > 0) {
      setGalleryPreviews(service.gallery_images);
    }
    if (isEditing && service?.featured_image) {
      setFeaturedImagePreview(service.featured_image);
    }
  }, [isEditing, service]);

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

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Split features by new line or comma
    const features = value.split(/[\n,]/).map(f => f.trim()).filter(f => f.length > 0);
    setFormData(prev => ({
      ...prev,
      features
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEditing ? `/api/services/${service.id}` : "/api/services"
      const method = isEditing ? "PUT" : "POST"
      
      // Prepare form data - use FormData if there's an image file
      let body: FormData | string;
      let headers: Record<string, string>;
      
      if (featuredImageFile || galleryImages.length > 0) {
        const formDataToSend = new FormData();
        
        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          // Only append featured_image if there's no uploaded file
          if (key === 'featured_image' && featuredImageFile) {
            // Skip featured_image field if we have an uploaded file
            return;
          }
          if (value !== null && value !== undefined) {
            if (key === 'features' && Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            } else {
              formDataToSend.append(key, value.toString());
            }
          }
        });
        
        // Add the featured image file if present
        if (featuredImageFile) {
          formDataToSend.append('featured_image_file', featuredImageFile);
        }
        
        // Add gallery images if present
        galleryImages.forEach((file) => {
          formDataToSend.append('gallery_images', file);
        });
        
        body = formDataToSend;
        headers = {};
      } else {
        // If no image, use JSON
        body = JSON.stringify(formData);
        headers = { "Content-Type": "application/json" };
      }

      const res = await fetch(url, {
        method,
        headers,
        credentials: 'same-origin',
        body,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
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
            {isEditing ? "Update" : "Create"} Service
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input id="title" value={formData.title} onChange={handleTitleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description *</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, full_description: e.target.value }))}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line or comma separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features?.join('\n') || ''}
                  onChange={handleFeaturesChange}
                  rows={4}
                  placeholder="e.g. Professional service delivery, Quality assurance, Timely completion"
                />
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
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}>
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
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Upload Image</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                    onClick={() => document.getElementById('featuredImageFileInput')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        {featuredImagePreview ? 'Click to change image' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (Max 5MB)
                      </p>
                      {featuredImageFile && (
                        <p className="text-xs text-muted-foreground mt-2 truncate max-w-full">
                          {featuredImageFile.name}
                        </p>
                      )}
                    </div>
                    <input
                      id="featuredImageFileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size exceeds 5MB limit');
                            return;
                          }
                          
                          setFeaturedImageFile(file);
                          
                          // Create preview URL
                          const previewUrl = URL.createObjectURL(file);
                          setFeaturedImagePreview(previewUrl);
                          
                          // Clear the URL field since we're using file upload
                          setFormData((prev) => ({ ...prev, featured_image: null }));
                        }
                      }}
                      aria-label="Upload featured image"
                    />
                  </div>
                </div>
                
                {featuredImagePreview && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={featuredImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {!featuredImagePreview && formData.featured_image && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.featured_image}
                      alt="Current featured image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Upload Gallery Images</Label>
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                    onClick={() => document.getElementById('galleryFileInput')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        Click to upload multiple images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (Max 5MB each)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {galleryImages.length > 0 ? `${galleryImages.length} image(s) selected` : 'No images selected'}
                      </p>
                    </div>
                    <input
                      id="galleryFileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const newFiles = Array.from(files).filter(file => {
                            // Validate file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setError('One or more files exceed 5MB limit');
                              return false;
                            }
                            return true;
                          });
                          
                          setGalleryImages(prev => [...prev, ...newFiles]);
                          
                          // Create preview URLs for new files
                          newFiles.forEach(file => {
                            const previewUrl = URL.createObjectURL(file);
                            setGalleryPreviews(prev => [...prev, previewUrl]);
                          });
                        }
                      }}
                      aria-label="Upload gallery images"
                    />
                  </div>
                </div>
                
                {galleryPreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Preview Gallery Images:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Gallery preview ${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              // Remove the preview and file
                              setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
                              setGalleryImages(prev => prev.filter((_, i) => i !== index));
                              
                              // Revoke the object URL to free memory
                              URL.revokeObjectURL(preview);
                            }}
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {galleryImages.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      // Clear all gallery images
                      galleryPreviews.forEach(preview => URL.revokeObjectURL(preview));
                      setGalleryPreviews([]);
                      setGalleryImages([]);
                    }}
                  >
                    Remove All Gallery Images
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