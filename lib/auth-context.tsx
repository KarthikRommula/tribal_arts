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
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }), // Note: password should be hashed on server
      })
      const data = await response.json()
      if (data.success) {
        const user = data.data
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      if (data.success) {
        const user = data.data
        // For now, check password on client (in production, this should be on server)
        if (user.password === password) {
          localStorage.setItem("user", JSON.stringify(user))
          setUser(user)
        } else {
          throw new Error("Invalid credentials")
        }
      } else {
        throw new Error("User not found")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    try {
      const response = await fetch("/api/users", {
        method: "PATCH", // Assuming we add PATCH to users API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...updates }),
      })
      const data = await response.json()
      if (data.success) {
        const updatedUser = { ...user, ...updates }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, updateProfile }}>
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
