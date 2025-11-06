"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Menu, X, LogOut, User, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"

const CATEGORIES = [
  { name: "All Products", href: "/products" },
  { name: "Jewelry", href: "/products?category=jewelry" },
  { name: "Textiles", href: "/products?category=textiles" },
  { name: "Art", href: "/products?category=art" },
  { name: "Home Decor", href: "/products?category=home%20decor" },
  { name: "Pottery", href: "/products?category=pottery" },
  { name: "Accessories", href: "/products?category=accessories" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showShopMenu, setShowShopMenu] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const { user, signOut, isAdmin } = useAuth()

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?._id) return

      try {
        const response = await fetch(`/api/user/messages?userId=${user._id}`)
        if (response.ok) {
          const messages = await response.json()
          const unreadCount = messages.filter((msg: any) => msg.status === 'unread').length
          setUnreadMessages(unreadCount)
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error)
      }
    }

    if (user) {
      fetchUnreadCount()
    }
  }, [user])

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-3 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/tribal_arts_logo.png"
              alt="Tribal Arts Logo"
              className="h-10 sm:h-15 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Shop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowShopMenu(true)}
              onMouseLeave={() => setShowShopMenu(false)}
            >
              <button
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              >
                Shop
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showShopMenu && (
                <div className="absolute top-full left-0 pt-2 w-48 z-10">
                  <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        onClick={() => setShowShopMenu(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className={`absolute top-0 right-0 ${wishlistCount > 9 ? 'w-5 h-4' : 'w-4 h-4'} bg-accent rounded-full text-xs text-accent-foreground flex items-center justify-center font-semibold`}>
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>
            </Link>
            <Link href="/cart">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent rounded-full text-[11px] text-accent-foreground flex items-center justify-center font-semibold ${itemCount > 99 ? 'px-0.5' : 'px-1'}`}>
                  {itemCount > 99 ? '99+' : (itemCount > 9 ? '9+' : itemCount)}
                </span>
                )}
              </button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <Link href="/signin">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
              )}

              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    My Orders
                  </Link>
                  <Link href="/messages" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    <span>My Messages</span>
                    {unreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Link>
                  {isAdmin() && (
                    <>
                      <div className="border-t border-border my-1"></div>
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors text-primary font-medium">
                        Admin Dashboard
                      </Link>
                      <Link href="/admin/orders" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors text-primary font-medium">
                        Manage Orders
                      </Link>
                      <Link href="/admin/messages" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors text-primary font-medium">
                        Contact Messages
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border flex flex-col gap-4">
            {/* Shop Section with Categories */}
            <div>
              <p className="text-sm font-semibold mb-2 text-muted-foreground">Shop</p>
              <div className="flex flex-col gap-2 pl-2">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            
            {/* Admin Links for Mobile */}
            {user && isAdmin() && (
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-sm font-semibold mb-2 text-muted-foreground">Admin</p>
                <div className="flex flex-col gap-2 pl-2">
                  <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors text-primary" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/admin/orders" className="text-sm font-medium hover:text-primary transition-colors text-primary" onClick={() => setIsOpen(false)}>
                    Manage Orders
                  </Link>
                  <Link href="/admin/messages" className="text-sm font-medium hover:text-primary transition-colors text-primary" onClick={() => setIsOpen(false)}>
                    Contact Messages
                  </Link>
                </div>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
