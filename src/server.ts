import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './config/db'
import projectRouter from './routes/projectRoutes'
import authRouter from './routes/authRoutes'
import cors from 'cors'
import corsConfig from './config/cors'
import morgan from 'morgan'

configDotenv()

// Database connection
connectDB()

const server = express()

// Uncomment the line below to enable CORS rules, see the CORS configuration file as imported on the top
server.use(cors(corsConfig))

server.use(morgan('dev'))

server.use(express.json())

// Routes
server.use('/api/projects', projectRouter)
server.use('/api/auth', authRouter)

export default server