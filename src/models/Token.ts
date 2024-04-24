import mongoose, { Schema, Document, Types } from 'mongoose'
import { generateToken } from '../utils/authUtils'

interface IToken extends Document {
  token: string
  user: Types.ObjectId
  createdAt: Date
}

const tokenSchema : Schema = new Schema({
  token: {
    type: String,
    default: generateToken(),    
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: '5m',
  }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)

export default Token