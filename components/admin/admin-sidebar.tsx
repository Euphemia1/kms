"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/add-admin", label: "Add Admin", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-17.5" : "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              {!collapsed && <span className="font-bold text-lg">KMS Admin</span>}
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
