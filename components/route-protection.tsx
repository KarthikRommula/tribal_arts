"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface RouteProtectionProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireUser?: boolean
}

export default function RouteProtection({
  children,
  requireAdmin = false,
  requireUser = false
}: RouteProtectionProps) {
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token")
    const userData = localStorage.getItem("user")

    // If this page requires admin access
    if (requireAdmin) {
      if (!adminToken) {
        router.push("/signin")
        return
      }
    }

    // If this page requires regular user access (not admin)
    if (requireUser) {
      // If user has admin token, redirect to admin dashboard
      if (adminToken) {
        router.push("/admin/dashboard")
        return
      }
      // If no user data, redirect to signin
      if (!userData) {
        router.push("/signin")
        return
      }
    }
  }, [router, requireAdmin, requireUser])

  return <>{children}</>
}