import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body, query } from "express-validator"
import { handleInputValidation } from "../middleware/validation"

const router = Router()

router.post('/create-account',
  body('name').notEmpty().withMessage('Name cannot be empty you dumbass'),
  body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
  body('password_confirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords doesn\'t match')
    }

    return true
  }),
  body('email').isEmail().withMessage('The email must be valid'),
  handleInputValidation,
  AuthController.createAccount
)

router.post('/confirm-account',  
  body('token').notEmpty().withMessage('Token cannot be empty'),
  handleInputValidation,
  AuthController.confirmAccount
)

router.post('/login',
  body('email').notEmpty().withMessage('Email cannot be empty'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  handleInputValidation,
  AuthController.loginAccount
)

export default router