import mongoose from 'mongoose';
import colors from 'colors'
import { exit } from 'node:process'

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL as string)
    console.log(colors.cyan.bold('Conection to database succeeded!'), `${connection.host}:${connection.port}`)
  } catch (err) {
    exit(1)
  }
}