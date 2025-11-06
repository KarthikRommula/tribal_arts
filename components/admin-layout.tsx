"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Users,
  ShoppingCart,
  Package,
  LogOut,
  Menu,
  X,
  Home,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface SidebarItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

const sidebarItems: SidebarItem[] = [
  { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/messages", icon: Mail, label: "Contact" },
]

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        sidebarCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              Admin Panel
            </h2>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex h-8 w-8 p-0"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    sidebarCollapsed && "lg:justify-center lg:px-2"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={cn(
                    "shrink-0",
                    sidebarCollapsed ? "h-5 w-5" : "mr-3 h-5 w-5"
                  )} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {item.badge && !sidebarCollapsed && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className={cn(
              "w-full flex items-center justify-center text-black hover:text-black hover:bg-gray-100",
              sidebarCollapsed && "lg:px-2"
            )}
          >
            <LogOut className={cn(
              "shrink-0",
              sidebarCollapsed ? "h-4 w-4" : "mr-2 h-4 w-4"
            )} />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {sidebarItems.find(item => item.href === pathname)?.label || "Admin"}
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
