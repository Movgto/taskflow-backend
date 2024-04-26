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

    console.log(token)

    try {      

      const tokenExists = await Token.findOne({token})

      console.log

      if (!tokenExists) {
        const error = new Error('The Token provided is not valid')

        return res.status(404).json({error: error.message})
      }

      const userExists = await User.findById(tokenExists.user)

      if (!userExists) {
        return res.json({
          error: 'The user linked to this token doesn\'t exist anymore'
        })
      }
      
      userExists.confirmed = true

      await Promise.allSettled([
        tokenExists.deleteOne(),
        userExists.save()
      ])

      return res.send('Your account has been confirmed, you can now login!')
            
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

      if (!userExists.confirmed) {
        const tokenExists = await Token.findOne({
          user: userExists.id
        })

        if (tokenExists) {
          const error = new Error('Your account has not been confirmed yet, please check your email')

          return res.status(409).json({
            error: error.message
          })
        }

        const token = new Token()

        token.user = userExists.id

        await token.save()

        Mailing.sendConfirmationEmail({
          email: userExists.email,
          name: userExists.name,
          token: token.token
        })

        const error = new Error('Your account has not been confirmed yet. We have sent you a confirmation code to your email.')

        return res.status(409).json({
          error: error.message
        })
      }
      
      const passwordMatch = await compare(password, userExists.password)

      if (!passwordMatch) {
        const error = new Error('The password provided is incorrect')

        return res.status(409).json({error: error.message})
      }

      
      res.send(`Welcome ${userExists.name}`)
    } catch (error) {
      
      res.status(500).json({
        error: 'We could\'t handle the requested action, please try again later.'
      })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const {email} = req.body
    try {
      const userExists = await User.findOne({email})

      if (!userExists) {
        const error = new Error('An user with the provided email was not found')

        return res.status(404).json({error: error.message})
      }

      const tokenExists = await Token.findOne({
        user: userExists.id
      })

      if (tokenExists) {
        const error = new Error('We have already sent you the intructions. Please check your email.')
        return res.status(409).json({error: error.message})
      }

      const token = new Token()

      token.user = userExists.id

      Mailing.sendResetPasswordInstructions({
       name: userExists.name,
       email: userExists.email,
       token: token.token
      })

      await token.save()

      res.send('We have sent instructions of how to reset your password, please check your email.')
      
    } catch (error) {
      res.status(500).json({
        error: 'We could\'t handle the requested action, please try again later.'
      })
    }
  }

  static validateToken = async (req: Request, res: Response) => {
    const {token} = req.params

    try {
      const tokenExists = await Token.findOne({token})

      if (!tokenExists) {
        const error = new Error('Invalid Token')
        return res.status(404).json({error: error.message})
      }

      const userExists = await User.findById(tokenExists.user)

      if (!userExists) {
        const error = new Error('An user with the provided email was not found')

        return res.status(404).json({error: error.message})
      }

      res.send('You can reset your password now!')

    } catch (error) {
      res.status(500).json({
        error: 'We could\'t handle the requested action, please try again later.'
      })
    }
  }

  static resetPassword = async (req: Request, res: Response) => {
    const {password} = req.body
    const {token} = req.params
    try {
      const tokenExists = await Token.findOne({token})

      if (!tokenExists) {
        const error = new Error('The time for resetting your password is over, please try again.')
        return res.status(404).json({
          error: error.message
        })
      }

      const userExists = await User.findById(tokenExists.user)

      if (!userExists) {
        const error = new Error('An user with the provided token was not found')

        return res.status(404).json({error: error.message})
      }

      userExists.password = await hashPassword(password)

      await Promise.allSettled([
        tokenExists.deleteOne(),
        userExists.save()
      ])

      res.send('Your password has been updated correctly!')
    } catch (error) {
      
    }
  }
}