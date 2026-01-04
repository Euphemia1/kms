export const runtime = 'nodejs' // ← ADD THIS LINE AT THE TOP

import { NextResponse, type NextRequest } from "next/server"
import { verifySessionInMiddleware } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  console.log("Middleware hit:", pathname)
  
  const sessionToken = request.cookies.get("kms_session")?.value
  console.log("Session token exists:", !!sessionToken)
  
  if (!sessionToken && pathname !== "/admin/login") {
    console.log("No session token, redirecting to login")
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  
  if (sessionToken) {
    try {
      const session = await verifySessionInMiddleware(sessionToken)
      console.log("Session valid:", session);
      
      if (!session) {
        console.log("Session not valid, redirecting to login")
        const res = NextResponse.redirect(new URL("/admin/login", request.url))
        res.cookies.delete("kms_session")
        return res
      }
      
      if (pathname === "/admin/login") {
        console.log("Already logged in, redirecting to dashboard")
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (error) {
      console.log("Session invalid:", error)
      const res = NextResponse.redirect(new URL("/admin/login", request.url))
      res.cookies.delete("kms_session")
      return res
    }
  }
  
  console.log("Allowing access to:", pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}