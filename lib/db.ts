import mongoose from 'mongoose'
let cached:any = (global as any)._mongo
if(!cached) (global as any)._mongo = cached = { conn: null }
export async function connectDB(){ if(cached.conn) return cached.conn; if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set'); const conn = await mongoose.connect(process.env.MONGODB_URI); cached.conn = conn; return conn }
