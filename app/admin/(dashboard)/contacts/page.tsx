import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building, Calendar } from "lucide-react"
import { ContactStatusUpdate } from "@/components/admin/contact-status-update"

interface Contact {
  id: string
  full_name: string
  email: string
  phone: string
  company: string
  subject: string
  service_interest: string
  message: string
  status: string
  created_at: string
}

async function getContacts() {
  const contacts = await query<Contact>("SELECT * FROM contact_submissions ORDER BY created_at DESC")
  return contacts
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  const statusColors: Record<string, string> = {
    unread: "bg-yellow-100 text-yellow-700 border-yellow-200",
    read: "bg-blue-100 text-blue-700 border-blue-200",
    responded: "bg-green-100 text-green-700 border-green-200",
    archived: "bg-gray-100 text-gray-700 border-gray-200",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className={contact.status === "unread" ? "border-l-4 border-l-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{contact.full_name}</CardTitle>
                    <CardDescription>{contact.subject || "No subject"}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[contact.status]}>{contact.status}</Badge>
                    <ContactStatusUpdate contactId={contact.id} currentStatus={contact.status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </span>
                  {contact.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                  )}
                  {contact.company && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {contact.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(contact.created_at).toLocaleString()}
                  </span>
                </div>
                {contact.service_interest && (
                  <div>
                    <span className="text-sm font-medium">Interested in: </span>
                    <Badge variant="outline">{contact.service_interest}</Badge>
                  </div>
                )}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
