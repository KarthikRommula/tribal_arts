"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
}

const FeaturedProductSkeleton = () => (
  <div className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
    <div className="relative aspect-square overflow-hidden bg-muted">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-6 flex flex-col grow">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          // Take only first 6 products for featured section
          setProducts(data.data.slice(0, 6))
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

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation() // Stop event bubbling

    const product = products.find(p => p._id === productId)
    if (!product) return

    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
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
  }
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-3">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Featured Collection</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Hand-selected tribal products that celebrate cultural heritage and artistic excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <FeaturedProductSkeleton key={index} />
              ))
            : products.map((product) => (
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

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
