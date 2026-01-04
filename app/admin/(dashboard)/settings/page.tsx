"use client"

import { useEffect, useState } from "react"
import { SettingsForm } from "@/components/admin/settings-form"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      
      if (data.success) {
        setSettings(data.settings)
      } else {
        setError(data.error || "Failed to load settings")
      }
    } catch (err) {
      setError("Failed to connect to server")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Manage your website configuration</p>
        </div>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Manage your website configuration</p>
      </div>
      {settings && <SettingsForm settings={settings} />}
    </div>
  )
}