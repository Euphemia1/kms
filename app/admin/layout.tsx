export const dynamic = "force-dynamic";

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | KMS SARL",
  description: "KMS SARL Administration Portal",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
