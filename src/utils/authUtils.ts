import { genSalt, hash } from "bcrypt"
import { Types } from "mongoose"
import jwt from 'jsonwebtoken'

export const hashPassword = async (pwd: string) => {
  const salt = await genSalt(10)

  const password = await hash(pwd, salt)

  return password
}

export const generateToken = () => {
  const token = Math.floor(100000 + Math.random() * 900000)

  return token.toString()
}

export type UserDataJWT = {
  id: Types.ObjectId
}

export const generateJWT = (userData : UserDataJWT) => {
  const token = jwt.sign(userData, process.env.JWT_SECRET!, {
    expiresIn: '180d'
  })

  return token
}