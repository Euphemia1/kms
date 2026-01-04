"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!data.authenticated) {
          // Redirect to login if not authenticated
          router.push('/admin/login');
          router.refresh();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login on error as well
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small delay to ensure cookie is properly set
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  if (loading) {
    // Show a loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="pl-64 transition-all duration-300">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
