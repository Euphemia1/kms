"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ApplicationStatusUpdate({
  applicationId,
  currentStatus,
}: {
  applicationId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
  }

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-32 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="reviewing">Reviewing</SelectItem>
        <SelectItem value="shortlisted">Shortlisted</SelectItem>
        <SelectItem value="interviewed">Interviewed</SelectItem>
        <SelectItem value="hired">Hired</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  )
}
