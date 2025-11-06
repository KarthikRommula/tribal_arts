import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  const client = new MongoClient(mongoUri)

  await client.connect()
  const db = client.db("tribal-arts")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Collections
export async function getProductsCollection() {
  const { db } = await connectToDatabase()
  return db.collection("products")
}

export async function getOrdersCollection() {
  const { db } = await connectToDatabase()
  return db.collection("orders")
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase()
  return db.collection("users")
}

export async function getCartCollection() {
  const { db } = await connectToDatabase()
  return db.collection("carts")
}

export async function getWishlistCollection() {
  const { db } = await connectToDatabase()
  return db.collection("wishlists")
}
