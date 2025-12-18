import { query } from "@/lib/db"
import { SettingsForm } from "@/components/admin/settings-form"

interface Setting {
  setting_key: string
  setting_value: string
}

async function getSettings() {
  const settings = await query<Setting>("SELECT * FROM site_settings")
  const settingsMap: Record<string, string> = {}
  settings.forEach((setting) => {
    settingsMap[setting.setting_key] = setting.setting_value
  })
  return settingsMap
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">Manage your website configuration</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
