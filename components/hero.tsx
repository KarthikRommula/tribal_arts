"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-secondary/20 to-background py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 text-balance">
                Authentic Tribal Crafts
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                Discover handcrafted tribal products directly from artisans around the world. Each piece tells a story
                of tradition, culture, and exceptional craftsmanship.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/tribal-artifacts-pottery-textiles.jpg"
                alt="Tribal crafts collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
