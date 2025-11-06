import { type NextRequest, NextResponse } from "next/server"
import { createContactMessage, getContactMessages } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const messages = await getContactMessages()
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, userId } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Create the contact message
    const result = await createContactMessage({
      name,
      email,
      subject,
      message,
      userId: userId || null, // Store user ID if provided
      replies: [], // Initialize empty replies array
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}