import { queryOne } from "@/lib/db"
import { ServiceForm } from "@/components/admin/service-form"

interface Service {
  id: string
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
  created_at: string
  updated_at: string
}

async function getService(id: string) {
  const service = await queryOne<any>(`SELECT id, title, slug, short_description, full_description, icon, featured_image, gallery_images, features, sort_order, is_active, created_at, updated_at FROM services WHERE id = ?`, [id])
  // Process the service to parse JSON fields
  if (service) {
    return {
      ...service,
      gallery_images: service.gallery_images && service.gallery_images !== 'null' ? JSON.parse(service.gallery_images) || [] : [],
      features: service.features ? JSON.parse(service.features) : [],
    };
  }
  return service
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getService(id)

  if (!service) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Service Not Found</h1>
          <p className="text-muted-foreground">The requested service does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update the service details</p>
      </div>
      <ServiceForm service={service} />
    </div>
  )
}