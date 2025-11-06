"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, ShoppingCart, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"

interface Product {
  _id: string
  name: string
  price: number
  image?: string
  category: string
  rating?: number
  reviews?: number
  description: string
  details?: string[]
  inStock?: boolean
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem, items, updateQuantity } = useCart()

  // Check if product is already in cart
  const cartItem = items.find(item => item.id === product?._id)
  const isInCart = !!cartItem
  const cartQuantity = cartItem?.quantity || 0
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.id as string
      if (!productId) {
        setError("Invalid product ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found")
          } else {
            setError(data.error || "Failed to load product")
          }
          return
        }

        if (data.success) {
          setProduct(data.data)
          setIsWishlisted(isInWishlist(data.data._id))
          // Fetch related products from the same category
          fetchRelatedProducts(data.data.category, data.data._id)
        } else {
          setError("Failed to load product")
        }
      } catch (err) {
        setError("Failed to load product")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchRelatedProducts = async (category: string, excludeId: string) => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()

        if (data.success) {
          const related = data.data
            .filter((p: Product) => p.category === category && p._id !== excludeId)
            .slice(0, 4)
          setRelatedProducts(related)
        }
      } catch (err) {
        console.error("Error fetching related products:", err)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product || isInCart) return

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.svg",
      quantity: quantity,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    if (!product) return
    updateQuantity(product._id, newQuantity)
  }

  const handleIncreaseQuantity = () => {
    if (!product) return
    updateQuantity(product._id, cartQuantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (!product) return
    if (cartQuantity > 1) {
      updateQuantity(product._id, cartQuantity - 1)
    }
  }

  const handleWishlistToggle = () => {
    if (!product) return

    if (isWishlisted) {
      removeFromWishlist(product._id)
      setIsWishlisted(false)
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder.svg",
      })
      setIsWishlisted(true)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-3 py-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Images Skeleton */}
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Product Details Skeleton */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>

                <Skeleton className="h-16 w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>

            {/* Related Products Skeleton */}
            <div className="mt-16">
              <Skeleton className="h-8 w-48 mb-8 mx-auto" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {error === "Product not found" ? "Product Not Found" : "Error Loading Product"}
            </h1>
            <p className="text-muted-foreground mb-4">
              {error === "Product not found"
                ? "The product you're looking for doesn't exist or may have been removed."
                : "There was an error loading this product. Please try again later."}
            </p>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-3 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="max-w-7xl mx-auto px-3 py-12">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Image */}
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-lg text-accent">★</span>
                    <span className="ml-2 font-semibold">{product.rating}</span>
                    <span className="ml-2 text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-3xl font-bold text-primary mb-4">₹{product.price.toFixed(2)}</p>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Product Features:</h3>
                <ul className="space-y-2">
                  {product.details && product.details.length > 0 ? (
                    product.details.map((detail: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {detail}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No additional details available</li>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                {isInCart ? (
                  // Item is already in cart - show cart quantity controls
                  <div>
                    <label className="block text-sm font-semibold mb-2">Quantity in Cart</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleDecreaseQuantity}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{cartQuantity}</span>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">This item is already in your cart</p>
                  </div>
                ) : (
                  // Item not in cart - show quantity selector and add button
                  <div>
                    <label className="block text-sm font-semibold mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {!isInCart && (
                    <Button
                      onClick={handleAddToCart}
                      className={`flex-1 gap-2 transition-all ${addedToCart ? "bg-accent hover:bg-accent text-accent-foreground" : "bg-primary hover:bg-primary/90"}`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {addedToCart ? "Added to Cart!" : "Add to Cart"}
                    </Button>
                  )}
                  {isInCart && (
                    <Button
                      asChild
                      className="flex-1 gap-2 bg-accent hover:bg-accent text-accent-foreground"
                    >
                      <Link href="/cart">
                        <ShoppingCart className="w-5 h-5" />
                        View in Cart
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-14 bg-transparent"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-accent text-accent" : ""}`} />
                  </Button>
                </div>
              </div>

              {product.inStock && (
                <p className="text-sm text-accent font-semibold">✓ In Stock - Ships within 2-3 business days</p>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((prod: Product) => (
                  <Link key={prod._id} href={`/products/${prod._id}`}>
                    <div className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={prod.image || "/placeholder.svg"}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">{prod.category}</p>
                        <h3 className="font-semibold line-clamp-2 mb-2">{prod.name}</h3>
                        <p className="text-lg font-bold text-primary">₹{prod.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center">No related products found</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
