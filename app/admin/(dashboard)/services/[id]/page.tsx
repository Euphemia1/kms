import { queryOne } from "@/lib/db"
import { ServiceForm } from "@/components/admin/service-form"

interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

async function getService(id: string) {
  const service = await queryOne<Service>("SELECT * FROM services WHERE id = ?", [id])
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