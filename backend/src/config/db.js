import mongoose from 'mongoose'
import { env } from './env.js'

let isConnected = false

export async function connectDB() {
  if (isConnected) return mongoose.connection

  mongoose.set('strictQuery', true)

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
    })
    isConnected = true
    console.log(`[db] MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false
  console.warn('[db] MongoDB disconnected')
})

export default connectDB
