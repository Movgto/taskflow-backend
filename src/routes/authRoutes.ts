import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body, param } from "express-validator"
import { handleInputValidation } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

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

router.post('/forgot-password',
  body('email').notEmpty().withMessage('Email cannot be empty'),
  handleInputValidation,
  AuthController.forgotPassword
)

router.post('/validate-token/:token',
  param('token').isNumeric().withMessage('Invalid token'),
  handleInputValidation,
  AuthController.validateToken
)

router.post('/reset-password/:token',
  param('token').isNumeric().withMessage('Invalid token'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
  body('password_confirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords doesn\'t match')
    }

    return true
  }),
  handleInputValidation,
  AuthController.resetPassword
)

router.get('/user',
  authenticate,
  AuthController.getUser
)

router.put('/user/profile',
  authenticate,
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email').isEmail().withMessage('Email cannot be empty'),
  handleInputValidation,
  AuthController.updateProfile
)

router.put('/user/change-password',
  authenticate,
  body('current_password').notEmpty().withMessage('Current password must not be empty'),
  body('password').notEmpty().withMessage('Password must not be empty'),
  body('password_confirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match')
    }

    return true
  }),
  handleInputValidation,
  AuthController.changePassword
)

router.post('/user/check-password',
  authenticate,
  body('password').notEmpty().withMessage('The password must not be empty'),
  handleInputValidation,
  AuthController.checkPassword
)
export default router