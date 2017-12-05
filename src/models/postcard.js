import mongoose from 'mongoose'


const postcardSchema = new mongoose.Schema({
  uid: { type: String },
  name: { type: String },
  kind: { type: String },   // vk, fb, tg
  made: { type: Boolean, default: true },
  sent: { type: Boolean, default: false },
  tgName: { type: String, default: false },
  vkSenderID: { type: Number },
  vkReceiverID: { type: Number },
  browserID: { type: String }

}, { timestamps:true})


export default mongoose.model('Postcard', postcardSchema)
