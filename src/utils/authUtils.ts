import { genSalt, hash } from "bcrypt"

export const hashPassword = async (pwd: string) => {
  const salt = await genSalt(10)

  const password = await hash(pwd, salt)

  return password
}

export const generateToken = () => {
  const token = Math.floor(1000 + Math.random() * 900000)

  return token.toString()
}