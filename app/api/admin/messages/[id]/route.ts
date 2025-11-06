import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getContactsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Middleware to verify admin token
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    console.log("Auth header:", authHeader ? "present" : "missing")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Invalid auth header format")
      return null
    }

    const token = authHeader.substring(7)
    console.log("Token extracted, verifying...")

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
    console.log("Token decoded:", { email: decoded.email, role: decoded.role })

    if (decoded.role === "admin") {
      console.log("Admin verified successfully")
      return decoded
    }

    console.log("User is not admin, role:", decoded.role)
    return null
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("Processing PATCH request for message ID:", id)

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.log("Invalid ObjectId:", id)
      return NextResponse.json({ success: false, error: "Invalid message ID" }, { status: 400 })
    }

    const admin = await verifyAdmin(request)
    if (!admin) {
      console.log("Admin verification failed")
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Request body:", body)
    const { status, reply } = body

    if (!status && !reply) {
      console.log("No status or reply provided")
      return NextResponse.json({ success: false, error: "Status or reply is required" }, { status: 400 })
    }

    const contactsCollection = await getContactsCollection()
    console.log("Got contacts collection")

    // First check if the message exists
    const existingMessage = await contactsCollection.findOne({ _id: new ObjectId(id) })
    console.log("Existing message:", existingMessage ? "found" : "not found")

    if (!existingMessage) {
      console.log("Message not found with ID:", id)
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 })
    }

    // Build update operations
    const updateOperations: any = {
      $set: {
        updatedAt: new Date()
      }
    }

    if (status) {
      updateOperations.$set.status = status
    }

    if (reply) {
      // Use $push to add to replies array (it will create the array if it doesn't exist)
      updateOperations.$push = {
        replies: {
          _id: new ObjectId(),
          message: reply,
          from: "admin",
          createdAt: new Date(),
        }
      }
    }

    console.log("Final update operations:", JSON.stringify(updateOperations, null, 2))

    const result = await contactsCollection.updateOne(
      { _id: new ObjectId(id) },
      updateOperations
    )

    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      console.log("No document was matched for update")
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 })
    }

    if (result.modifiedCount === 0) {
      console.log("Document was found but not modified")
      // This might happen if we're trying to set the same status
    }

    console.log("Message updated successfully")
    return NextResponse.json({ success: true, message: "Message updated successfully" })
  } catch (error) {
    console.error("Message update error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 500 })
  }
}