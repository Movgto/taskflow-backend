import type { Request, Response} from 'express'
import User from '../models/User'
import { generateToken, hashPassword } from '../utils/authUtils'
import Token from '../models/Token'
import Mailing from '../services/Mailing'
import { compare } from 'bcrypt'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body

      const emailExists = await User.findOne({
        email
      })

      if (emailExists) {
        const error = new Error('There\'s already an user with the same email')

        return res.status(409).json({
          error: error.message
        })
      }

      const user = new User(req.body)

      user.password = await hashPassword(password)

      const token = new Token()

      token.token = generateToken()

      token.user = user.id

      await Mailing.sendConfirmationEmail({
        email: user.email,
        token: token.token,
        name: user.name
      })

      await Promise.allSettled([
        user.save(),
        token.save(),
      ])

      res.send('A new User has been created successfully!')
    } catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  static confirmAccount= async (req: Request, res: Response) => {
    const token = req.body.token
    const userId = req.query.userId

    try {
      console.log(userId)
      const userExists = await User.findById(userId)

      console.log(userExists)

      if (!userExists) {
        const error = new Error('The user doesn\'t exist in the database')

        return res.status(404).json({error: error.message})
      }

      const tokenExists = await Token.findOne({token})

      if (!tokenExists) {
        const error = new Error('The Token provided is not valid')

        return res.status(404).json({error: error.message})
      }

      if (tokenExists.user.toString() === userExists.id) {
        userExists.confirmed = true

        await Promise.allSettled([
          tokenExists.deleteOne(),
          userExists.save()
        ])

        return res.send('Your account has been confirmed, you can now login!')
      }

      res.status(500).json({
        error: 'Sorry, something went wrong when trying to confirm your account, please try again later'
      })
    } catch (error) {
      res.status(500).json({
        error: 'Sorry, something went wrong when trying to confirm your account, please try again later'
      })
    }
  }

  static loginAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const userExists = await User.findOne({email})

      if (!userExists) {
        const error = new Error('An user with the provided email was not found')

        return res.status(404).json({error: error.message})
      }
      
      const passwordMatch = await compare(password, userExists.password)

      if (!passwordMatch) {
        const error = new Error('The password provided is incorrect')

        res.status(409).json({error: error.message})
      }
      
      res.send(`Welcome ${userExists.name}`)
    } catch (error) {
      
    }
  }
}