import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  confirmed: boolean
}

const userSchema : Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  confirmed: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model<IUser>('User', userSchema)

export default User