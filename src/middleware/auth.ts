import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    const error = new Error('Invalid action')
    return res.status(401).json({
      error: error.message
    })
  }

  const token = bearer.split(' ')[1]

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET!)
  
    if (typeof userData === 'object' && userData.id) {
      const user = await User.findById(userData.id).select('_id name email')

      if (user) {
        req.user = user
      } else {
        return res.status(401).json({
          error: 'Not Authorized'
        })
      }
    }
  } catch (error) {
    return res.status(401).json({
      error: 'Not Authorized'
    })
  }

  next()
}