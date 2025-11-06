import { type NextRequest, NextResponse } from "next/server"
import { getContactsCollection } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const contactsCollection = await getContactsCollection()

    // Get messages for this user
    const messages = await contactsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("User messages API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}