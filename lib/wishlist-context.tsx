"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load wishlist based on authentication status
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true)
      if (userId) {
        // User is logged in - load from DB only
        try {
          const response = await fetch(`/api/wishlist?userId=${userId}`)
          const data = await response.json()
          if (data.success) {
            setItems(data.data)
          } else {
            // If no wishlist in DB, start with empty wishlist
            setItems([])
          }
        } catch (error) {
          console.error("Error loading wishlist from DB:", error)
          setItems([]) // Start with empty wishlist on error
        }
      } else {
        // User not logged in - use localStorage for guest wishlist
        const savedWishlist = localStorage.getItem("guest_wishlist")
        if (savedWishlist) {
          try {
            setItems(JSON.parse(savedWishlist))
          } catch (error) {
            console.error("Error parsing guest wishlist:", error)
            setItems([])
          }
        } else {
          setItems([])
        }
      }
      setMounted(true)
      setIsLoading(false)
    }
    loadWishlist()
  }, [userId])

  // Sync wishlist changes to appropriate storage
  useEffect(() => {
    if (mounted && !isLoading) {
      if (userId) {
        // User logged in - sync to DB only
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items }),
        }).catch((error) => console.error("Error syncing wishlist to DB:", error))
      } else {
        // User not logged in - save to localStorage
        localStorage.setItem("guest_wishlist", JSON.stringify(items))
      }
    }
  }, [items, mounted, userId, isLoading])

  const addItem = (newItem: WishlistItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prevItems // Item already exists, don't add duplicate
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = async () => {
    setItems([])
    if (userId) {
      // Clear from DB
      try {
        await fetch(`/api/wishlist?userId=${userId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error clearing wishlist from DB:", error)
      }
    } else {
      // Clear localStorage
      localStorage.removeItem("guest_wishlist")
    }
  }

  const itemCount = items.length

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist, itemCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return context
}