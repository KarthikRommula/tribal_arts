"use client"

import type React from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <CartProvider userId={user?._id}>
      <WishlistProvider userId={user?._id}>
        {children}
      </WishlistProvider>
    </CartProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProvidersInner>{children}</ProvidersInner>
    </AuthProvider>
  )
}