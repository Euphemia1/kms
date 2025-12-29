export const runtime = 'nodejs' // ← ADD THIS LINE AT THE TOP

import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = '06cd73b65cc986d84756ba2a56c07eb1d7cc1b7a2fbd295478a60b6e8f3c9d8a'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  console.log("Middleware hit:", pathname)
  
  const token = request.cookies.get("token")?.value
  console.log("Token exists:", !!token)
  
  if (!token && pathname !== "/admin/login") {
    console.log("No token, redirecting to login")
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log("Token valid:", decoded)
      
      if (pathname === "/admin/login") {
        console.log("Already logged in, redirecting to dashboard")
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (error) {
      console.log("Token invalid:", error)
      const res = NextResponse.redirect(new URL("/admin/login", request.url))
      res.cookies.delete("token")
      return res
    }
  }
  
  console.log("Allowing access to:", pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}