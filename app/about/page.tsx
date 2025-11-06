"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src="/tribal_arts_logo.png"
                alt="Tribal Arts Logo"
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">About Tribal Arts</h1>
            <p className="text-xl text-muted-foreground">
              Celebrating authentic indigenous craftsmanship and cultural heritage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                At Tribal Arts, we are dedicated to preserving and promoting indigenous art forms
                and craftsmanship. We work directly with artisans from various indigenous communities
                to bring their authentic creations to a global audience.
              </p>
              <p className="text-muted-foreground">
                Every piece in our collection tells a story of tradition, culture, and skilled
                craftsmanship passed down through generations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>• <strong>Authenticity:</strong> Only genuine indigenous craftsmanship</li>
                <li>• <strong>Fair Trade:</strong> Direct partnerships with artisans</li>
                <li>• <strong>Cultural Respect:</strong> Honoring traditional practices</li>
                <li>• <strong>Sustainability:</strong> Eco-friendly materials and processes</li>
                <li>• <strong>Community Support:</strong> Empowering indigenous communities</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2025, Tribal Arts began as a small initiative to connect indigenous
                artisans with conscious consumers. What started as a passion project has grown
                into a platform that supports hundreds of artisans across different cultures.
              </p>
              <p>
                We believe that by purchasing authentic indigenous art, you're not just acquiring
                a beautiful piece – you're supporting cultural preservation and sustainable
                livelihoods. Each purchase helps maintain traditional crafts that might otherwise
                be lost to modernization.
              </p>
              <p>
                Our commitment extends beyond commerce. We actively participate in cultural
                education programs and work with communities to ensure that traditional knowledge
                continues to thrive for future generations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}