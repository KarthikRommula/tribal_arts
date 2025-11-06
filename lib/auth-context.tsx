"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  _id?: string
  email: string
  name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // This POST route is now secure (see api/users/route.ts)
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // The API route now returns the new user data (without password)
        const user = data.data 
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
      } else {
        if (response.status === 409) {
          throw new Error("An account with this email already exists")
        } else if (response.status === 400) {
          throw new Error(data.error || "Please provide all required information")
        } else {
          throw new Error(data.error || "Failed to create account. Please try again.")
        }
      }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
     }
  }

  //
  // --- *** FIXED: signIn Function *** ---
  // This now POSTs credentials to a secure API route
  // and receives user data (without password) in return.
  //
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. POST to the new secure sign-in route
      const response = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      // 2. Check for success
      if (response.ok && data.success) {
        const user = data.data // This user object does NOT contain a password

        // Handle admin login
        if (data.isAdmin) {
          localStorage.setItem("admin_token", data.token)
          localStorage.setItem("user", JSON.stringify(user))
          // Set cookies for middleware
          document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          document.cookie = `user=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          setUser(user)
          return true // Return true for admin
        } else {
          // Regular user login
          localStorage.setItem("user", JSON.stringify(user))
          // Set user cookie for middleware
          document.cookie = `user=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          setUser(user)
          return false // Return false for regular user
        }
      } else {
        if (response.status === 401) {
          throw new Error("Invalid email or password")
        } else if (response.status === 400) {
          throw new Error("Please provide email and password")
        } else {
          throw new Error(data.error || "Failed to sign in. Please try again.")
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }
  // --- *** END FIX *** ---

  const signOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("admin_token")
    // Clear cookies
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setUser(null)
  }

  const isAdmin = () => {
    return !!localStorage.getItem("admin_token")
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    try {
      // This PATCH route is correct and updates the user in the DB
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...updates }),
      })
      const data = await response.json()
      if (data.success) {
        // The API returns the updated user data (or just a success flag)
        // We optimistically update the user in state
        const updatedUser = { ...user, ...updates }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        throw new Error(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, updateProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}