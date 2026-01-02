"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
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

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  description: string
  partner_type: string
  sort_order: number
  is_active: boolean
}

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [partner, setPartner] = useState<Partner>({
    id: "",
    name: "",
    logo_url: "",
    website_url: "",
    description: "",
    partner_type: "client",
    sort_order: 0,
    is_active: true
  })

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we'll simulate with mock data
    if (params.id !== "new") {
      // Simulate API call
      setTimeout(() => {
        setPartner({
          id: params.id,
          name: "Gécamines SA",
          logo_url: "/photos/gecamines.jpg",
          website_url: "https://gecamines.cd",
          description: "State-owned mining company in the Democratic Republic of the Congo",
          partner_type: "client",
          sort_order: 1,
          is_active: true
        })
        setIsLoading(false)
      }, 500)
    } else {
      setIsLoading(false)
    }
  }, [params.id])

  const handleChange = (field: keyof Partner, value: string | number | boolean) => {
    setPartner(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/admin/partners")
    } catch (error) {
      console.error("Error saving partner:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/partners">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {params.id === "new" ? "Add New Partner" : "Edit Partner"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Partner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                value={partner.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Enter partner name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={partner.logo_url}
                onChange={(e) => handleChange("logo_url", e.target.value)}
                placeholder="/photos/partner-logo.jpg"
              />
              {partner.logo_url && (
                <div className="mt-2">
                  <img 
                    src={partner.logo_url} 
                    alt="Preview" 
                    className="h-16 object-contain border rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={partner.website_url}
                onChange={(e) => handleChange("website_url", e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={partner.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Brief description of the partnership"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="partner_type">Partner Type</Label>
                <Select value={partner.partner_type} onValueChange={(value) => handleChange("partner_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={partner.sort_order}
                  onChange={(e) => handleChange("sort_order", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={partner.is_active}
                onCheckedChange={(checked) => handleChange("is_active", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/partners">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Partner
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}