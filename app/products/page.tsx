"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
  rating?: number
  reviews?: number
  description?: string
  details?: string[]
  inStock?: boolean
}

const CATEGORIES = ["All", "Jewelry", "Home Decor", "Textiles", "Pottery", "Art", "Accessories"]

const ProductCardSkeleton = () => (
  <div className="bg-card rounded-lg overflow-hidden h-full flex flex-col">
    <div className="relative aspect-square overflow-hidden bg-muted">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-6 flex flex-col grow">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-16 mb-4" />
      <div className="mt-auto flex items-end justify-between pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  </div>
)

const ImageWithSkeleton = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedRanges, setSelectedRanges] = useState<string[]>(["Under ₹3000", "₹3000 - ₹8000", "Over ₹8000"])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch products from database')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Set category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      // Capitalize first letter of each word to match category names
      const formattedCategory = categoryParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      setSelectedCategory(formattedCategory)
    }
  }, [categoryParam])

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation() // Stop event bubbling

    const product = products.find(p => p._id === productId)
    if (!product) return

    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
      })
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation() // Stop event bubbling

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory === "All" || p.category === selectedCategory
    const priceMatch = selectedRanges.length === 0 || selectedRanges.some(range => {
      if (range === "Under ₹3000") return p.price < 3000
      if (range === "₹3000 - ₹8000") return p.price >= 3000 && p.price <= 8000
      if (range === "Over ₹8000") return p.price > 8000
      return false
    })
    return categoryMatch && priceMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-secondary/10 py-12">
          <div className="max-w-7xl mx-auto px-3">
            <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
            <p className="text-muted-foreground">Explore our curated selection of authentic tribal products</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="font-semibold mb-4">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {["Under ₹3000", "₹3000 - ₹8000", "Over ₹8000"].map((range) => (
                      <label key={range} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRanges.includes(range)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRanges([...selectedRanges, range])
                            } else {
                              setSelectedRanges(selectedRanges.filter(r => r !== range))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="ml-2 text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Free shipping on orders over ₹5000</p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Showing {sortedProducts.length} products</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))
                  : sortedProducts.map((product) => (
                      <Link key={product._id} href={`/products/${product._id}`}>
                        <div className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            <ImageWithSkeleton
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              onClick={(e) => handleWishlistToggle(e, product._id)}
                              className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur hover:bg-background rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-accent text-accent" : "text-accent"}`} />
                            </button>
                          </div>
                          <div className="p-6 flex flex-col grow">
                            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center mb-4">
                              <span className="text-sm text-accent">★</span>
                              <span className="text-sm ml-1">{product.rating}</span>
                            </div>
                            <div className="mt-auto flex items-end justify-between pt-4">
                              <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                              <button 
                                onClick={(e) => handleAddToCart(e, product)}
                                className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                              >
                                <ShoppingCart className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
