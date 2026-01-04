export const dynamic = "force-dynamic";
import { query } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Eye, EyeOff } from "lucide-react"
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
  created_at: string
}

async function getPartners() {
  const partners = await query<Partner>("SELECT * FROM partners ORDER BY sort_order ASC, created_at DESC")
  return partners
}

export default async function PartnersPage() {
  const partners = await getPartners()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partners & Clients</h1>
          <p className="text-muted-foreground">Manage your company partners and clients</p>
        </div>
        <Button asChild>
          <Link href="/admin/partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No partners or clients yet</p>
            <Button asChild>
              <Link href="/admin/partners/new">Add your first partner</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted rounded-lg flex items-center justify-center w-16 h-16">
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name} 
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement!.innerHTML = '<div class="text-xs text-muted-foreground p-2">No image</div>';
                          }}
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">No logo</div>
                      )}
                    </div>
                    <div>
                      <CardTitle>{partner.name}</CardTitle>
                      <CardDescription>
                        {partner.partner_type.charAt(0).toUpperCase() + partner.partner_type.slice(1)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={partner.is_active ? "default" : "secondary"}>
                      {partner.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/partners/${partner.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {partner.website_url && (
                    <div>
                      <span className="font-medium">Website:</span> {partner.website_url}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Sort Order:</span> {partner.sort_order}
                  </div>
                  <div>
                    <span className="font-medium">Added:</span> {new Date(partner.created_at).toLocaleDateString()}
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