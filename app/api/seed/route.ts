import { type NextRequest, NextResponse } from "next/server"
import { createProduct } from "@/lib/db-utils"

// Sample data for seeding
const SAMPLE_PRODUCTS = [
  {
    name: "Tribal Beaded Necklace",
    price: 2500,
    image: "/tribal-beaded-necklace-handmade.jpg",
    category: "Jewelry",
    rating: 4.8,
    reviews: 124,
    description: "A stunning handcrafted beaded necklace featuring authentic tribal patterns. Each bead is carefully selected and strung by skilled artisans, making this piece truly unique. Perfect as a statement piece or everyday accessory.",
    details: ["Handcrafted by artisans", "Made with natural materials", "Adjustable length", "Authentic tribal design", "Eco-friendly packaging"],
    inStock: true,
  },
  {
    name: "Woven Basket",
    price: 3500,
    image: "/traditional-woven-basket-tribal.jpg",
    category: "Home Decor",
    rating: 4.9,
    reviews: 89,
    description: "A traditional woven basket that brings warmth to any space. Created using traditional techniques passed down through generations, this basket is both functional and decorative.",
    details: ["Handwoven with natural fibers", "Perfect for storage", "Adds rustic charm to any room", "Durable and long-lasting", "Unique pattern variations"],
    inStock: true,
  },
  {
    name: "Ethnic Textile Rug",
    price: 12000,
    image: "/tribal-ethnic-textile-rug.jpg",
    category: "Textiles",
    rating: 4.7,
    reviews: 56,
    description: "A beautiful ethnic textile rug featuring intricate tribal patterns. This versatile rug can enhance the aesthetic of any room with its rich colors and traditional designs.",
    details: ["Hand-dyed natural fibers", "Traditional weaving techniques", "Large size (5x7 ft)", "Machine washable", "Sustainable materials"],
    inStock: true,
  },
  {
    name: "Clay Pottery Set",
    price: 4500,
    image: "/handmade-tribal-pottery-set.jpg",
    category: "Pottery",
    rating: 4.9,
    reviews: 98,
    description: "A complete pottery set handmade from clay using traditional methods. Each piece in this set is functional art, perfect for dining or display.",
    details: ["Handthrown pottery", "Food-safe materials", "Set of 4 pieces", "Unique glaze work", "Collector's quality"],
    inStock: true,
  },
  {
    name: "Tribal Mask",
    price: 6000,
    image: "/authentic-tribal-mask-art.jpg",
    category: "Art",
    rating: 4.6,
    reviews: 67,
    description: "An authentic tribal mask carved by master artisans. This piece represents centuries of cultural tradition and makes an impressive statement in any collection.",
    details: ["Hand-carved from wood", "Traditional designs", "Collector's piece", "Certificate of authenticity", "Gallery quality"],
    inStock: true,
  },
  {
    name: "Leather Bag",
    price: 4000,
    image: "/tribal-leather-bag-handcrafted.jpg",
    category: "Accessories",
    rating: 4.8,
    reviews: 112,
    description: "A handcrafted leather bag with tribal-inspired design. Made from premium leather and featuring unique ethnic patterns, this bag is both practical and stylish.",
    details: ["Genuine leather", "Handcrafted design", "Multiple compartments", "Adjustable straps", "Lifetime warranty"],
    inStock: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    for (const product of SAMPLE_PRODUCTS) {
      await createProduct(product)
    }
    return NextResponse.json({ success: true, message: "Database seeded with sample products" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}