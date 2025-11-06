import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, updateUserProfile } from "@/lib/db-utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params
    const user = await getUserByEmail(decodeURIComponent(email))
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    const { email } = await params
    const body = await request.json()
    const result = await updateUserProfile(email, body)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}
