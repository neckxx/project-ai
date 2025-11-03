import mongoose from 'mongoose'
const ConvSchema = new mongoose.Schema({ userId:{ type:String, required:true, index:true }, title:String, messages:Array, createdAt:{ type:Date, default:Date.now } })
export default mongoose.models.Conversation || mongoose.model('Conversation', ConvSchema)
