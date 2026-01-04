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

interface Project {
  id?: string
  title: string
  slug: string
  description: string
  full_description: string | null
  category: string
  client: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  status: string
  featured_image: string | null
  featured_video: string | null
  is_featured: boolean
  is_published: boolean
  gallery_images: string[] | null
}

const defaultProject: Project = {
  title: "",
  slug: "",
  description: "",
  full_description: null,
  category: "construction",
  client: null,
  location: null,
  start_date: null,
  end_date: null,
  status: "ongoing",
  featured_image: null,
  featured_video: null,
  is_featured: false,
  is_published: false,
  gallery_images: null,
}

export function ProjectForm({ project }: { project?: Project }) {
  const [formData, setFormData] = useState<Project>(project || defaultProject)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const router = useRouter()

  const isEditing = !!project?.id
  
  // Initialize gallery previews when editing a project
  React.useEffect(() => {
    if (isEditing && project?.gallery_images && project.gallery_images.length > 0) {
      setGalleryPreviews(project.gallery_images);
    }
  }, [isEditing, project]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEditing ? `/api/projects/${project.id}` : "/api/projects"
      const method = isEditing ? "PUT" : "POST"
      
      // Prepare form data - use FormData if there's an image file
      let body: FormData | string;
      let headers: Record<string, string>;
      
      if (imageFile || galleryImages.length > 0) {
        const formDataToSend = new FormData();
        
        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          // Only append featured_image if there's no uploaded file
          if (key === 'featured_image' && imageFile) {
            // Skip featured_image field if we have an uploaded file
            return;
          }
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value.toString());
          }
        });
        
        // Add the featured image file if present
        if (imageFile) {
          formDataToSend.append('featured_image_file', imageFile);
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
        throw new Error(data.error || "Failed to save project")
      }

      router.push("/admin/projects")
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
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="published" className="text-sm">
              Published
            </Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditing ? "Update" : "Create"} Project
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
                <Label htmlFor="title">Project Title *</Label>
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
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, full_description: e.target.value || null }))}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={formData.client || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value || null }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value || null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value || null }))}
                  />
                </div>
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="mining">Mining</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="featured" className="text-sm">
                  Featured Project
                </Label>
                <Switch
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
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
                    onClick={() => document.getElementById('imageFileInput')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        {imagePreview ? 'Click to change image' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF (Max 5MB)
                      </p>
                      {imagePreview && (
                        <p className="text-xs text-muted-foreground mt-2 truncate max-w-full">
                          {imageFile?.name}
                        </p>
                      )}
                    </div>
                    <input
                      id="imageFileInput"
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
                          
                          setImageFile(file);
                          
                          // Create preview URL
                          const previewUrl = URL.createObjectURL(file);
                          setImagePreview(previewUrl);
                          
                          // Clear the URL field since we're using file upload
                          setFormData((prev) => ({ ...prev, featured_image: null }));
                        }
                      }}
                      aria-label="Upload featured image"
                    />
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {!imagePreview && formData.featured_image && (
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
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


