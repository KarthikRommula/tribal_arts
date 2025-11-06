import { getProductsCollection, getOrdersCollection, getUsersCollection, getCartCollection, getWishlistCollection } from "./mongodb"
import { ObjectId } from "mongodb"

// Product functions
export async function getProducts() {
  try {
    const products = await getProductsCollection()
    const dbProducts = await products.find({}).toArray()
    if (dbProducts.length === 0) {
      throw new Error("No products found in database. Please seed the database first.")
    }
    return dbProducts
  } catch (error) {
    console.error("Error fetching products from database:", error)
    throw new Error("Failed to fetch products from database")
  }
}

export async function getProductById(id: string) {
  try {
    const products = await getProductsCollection()
    // Try to parse as ObjectId
    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch {
      // If id is not a valid ObjectId, return null
      return null
    }
    const product = await products.findOne({ _id: objectId })
    return product
  } catch (error) {
    console.error("Error fetching product from database:", error)
    return null
  }
}

export async function createProduct(product: any) {
  const products = await getProductsCollection()
  const result = await products.insertOne({
    ...product,
    createdAt: new Date(),
  })
  return result
}

// Order functions
export async function createOrder(order: any) {
  const orders = await getOrdersCollection()
  const result = await orders.insertOne({
    ...order,
    createdAt: new Date(),
    status: "confirmed",
  })
  return result
}

export async function getOrdersByEmail(email: string) {
  const orders = await getOrdersCollection()
  return orders.find({ "customer.email": email }).toArray()
}

export async function getOrderById(id: string) {
  const orders = await getOrdersCollection()
  return orders.findOne({ _id: new ObjectId(id) })
}

// User functions
export async function getUserByEmail(email: string) {
  const users = await getUsersCollection()
  return users.findOne({ email })
}

export async function createUser(user: any) {
  const users = await getUsersCollection()
  const result = await users.insertOne({
    ...user,
    createdAt: new Date(),
  })
  return result
}

export async function updateUserProfile(email: string, updates: any) {
  const users = await getUsersCollection()
  const result = await users.updateOne({ email }, { $set: { ...updates, updatedAt: new Date() } })
  return result
}

// Cart functions
export async function getCartByUserId(userId: string) {
  const carts = await getCartCollection()
  return carts.findOne({ userId })
}

export async function updateCart(userId: string, items: any[]) {
  const carts = await getCartCollection()
  const result = await carts.updateOne(
    { userId },
    { $set: { items, updatedAt: new Date() } },
    { upsert: true }
  )
  return result
}

export async function clearCart(userId: string) {
  const carts = await getCartCollection()
  return carts.deleteOne({ userId })
}

// Wishlist functions
export async function getWishlistByUserId(userId: string) {
  const wishlists = await getWishlistCollection()
  return wishlists.findOne({ userId })
}

export async function updateWishlist(userId: string, items: any[]) {
  const wishlists = await getWishlistCollection()
  const result = await wishlists.updateOne(
    { userId },
    { $set: { items, updatedAt: new Date() } },
    { upsert: true }
  )
  return result
}

export async function clearWishlist(userId: string) {
  const wishlists = await getWishlistCollection()
  return wishlists.deleteOne({ userId })
}
