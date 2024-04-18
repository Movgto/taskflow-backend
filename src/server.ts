import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './config/db'
import projectRouter from './routes/projectRoutes'
import cors from 'cors'
import corsConfig from './config/cors'
import morgan from 'morgan'

configDotenv()

connectDB()

const server = express()

server.use(cors(corsConfig))

server.use(morgan('dev'))

server.use(express.json())

server.use('/api/projects', projectRouter)

export default server