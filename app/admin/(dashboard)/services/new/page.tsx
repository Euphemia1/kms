import { ServiceForm } from "@/components/admin/service-form"

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Service</h1>
        <p className="text-muted-foreground">Add a new service to your offerings</p>
      </div>
      <ServiceForm />
    </div>
  )
}