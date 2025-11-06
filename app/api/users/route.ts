import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, updateUserProfile } from "@/lib/db-utils"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, error: "Email parameter is required" }, { status: 400 })
    }

    // getUserByEmail now correctly omits the password
    const user = await getUserByEmail(email) 
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

//
// --- *** FIXED: POST (Sign-up) *** ---
// This now hashes the password and checks for existing users.
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // 1. Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 409 })
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Create the user with the hashed password
    const result = await createUser({ 
      email, 
      name, 
      password: hashedPassword 
    })

    // 4. Fetch the newly created user (without password) to return to client
    const newUser = await getUserByEmail(email)

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
// --- *** END FIX *** ---

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, ...updates } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Ensure password cannot be updated via this generic endpoint
    if (updates.password) {
      delete updates.password
    }

    const result = await updateUserProfile(email, updates)
    
    // Fetch and return the updated user data (without password)
    const updatedUser = await getUserByEmail(email)

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}