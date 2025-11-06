"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart based on authentication status
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      if (userId) {
        // User is logged in - load from DB only
        try {
          const response = await fetch(`/api/cart?userId=${userId}`)
          const data = await response.json()
          if (data.success) {
            setItems(data.data)
          } else {
            // If no cart in DB, start with empty cart
            setItems([])
          }
        } catch (error) {
          console.error("Error loading cart from DB:", error)
          setItems([]) // Start with empty cart on error
        }
      } else {
        // User not logged in - use localStorage for guest cart
        const savedCart = localStorage.getItem("guest_cart")
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart))
          } catch (error) {
            console.error("Error parsing guest cart:", error)
            setItems([])
          }
        } else {
          setItems([])
        }
      }
      setMounted(true)
      setIsLoading(false)
    }
    loadCart()
  }, [userId])

  // Sync cart changes to appropriate storage
  useEffect(() => {
    if (mounted && !isLoading) {
      if (userId) {
        // User logged in - sync to DB only
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items }),
        }).catch((error) => console.error("Error syncing cart to DB:", error))
      } else {
        // User not logged in - save to localStorage
        localStorage.setItem("guest_cart", JSON.stringify(items))
      }
    }
  }, [items, mounted, userId, isLoading])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item,
        )
      }
      return [...prevItems, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = async () => {
    setItems([])
    if (userId) {
      // Clear from DB
      try {
        await fetch(`/api/cart?userId=${userId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error clearing cart from DB:", error)
      }
    } else {
      // Clear localStorage
      localStorage.removeItem("guest_cart")
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
