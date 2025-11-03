import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({ username:{ type:String, required:true, unique:true }, email:{ type:String, unique:true, sparse:true }, phone:{ type:String, unique:true, sparse:true }, password:{ type:String, required:true }, createdAt:{ type:Date, default:Date.now } })
export default mongoose.models.User || mongoose.model('User', UserSchema)
