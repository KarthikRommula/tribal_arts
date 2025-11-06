"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import RouteProtection from "@/components/route-protection"

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoading, updateProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    } else if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      })
    }
  }, [user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setMessage("Profile updated successfully!")
      setIsEditing(false)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to update profile")
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <RouteProtection requireUser={true}>
      <>
        <Header />
        <main className="min-h-screen">
          <div className="bg-secondary/10 py-8">
            <div className="max-w-7xl mx-auto px-3">
              <h1 className="text-3xl font-bold">My Account</h1>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-3 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold mb-4">Menu</h2>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                      Account Settings
                    </button>
                    <Link href="/orders">
                      <button className="w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-between">
                        My Orders
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        router.push("/")
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Account Information</h2>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className={isEditing ? "" : "bg-primary hover:bg-primary/90"}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  {message && (
                    <div className="bg-accent/20 border border-accent/30 text-accent-foreground px-4 py-3 rounded-lg mb-6 text-sm">
                      {message}
                    </div>
                  )}

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Save Changes
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-semibold">{formData.name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-semibold">{formData.phone || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="font-semibold">
                          {formData.address
                            ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </RouteProtection>
  )
}
