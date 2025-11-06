import { type NextRequest, NextResponse } from "next/server"
import { getWishlistByUserId, updateWishlist, clearWishlist } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID parameter is required" }, { status: 400 })
    }

    const wishlist = await getWishlistByUserId(userId)
    return NextResponse.json({ success: true, data: wishlist?.items || [] })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const result = await updateWishlist(userId, items)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error updating wishlist:", error)
    return NextResponse.json({ success: false, error: "Failed to update wishlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID parameter is required" }, { status: 400 })
    }

    const result = await clearWishlist(userId)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return NextResponse.json({ success: false, error: "Failed to clear wishlist" }, { status: 500 })
  }
}