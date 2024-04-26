import transport from "../config/nodemailer"

type IMailingService = {
  email: string
  name: string
  token: string
}

class Mailing {
  static sendConfirmationEmail = async (user: Pick<IMailingService, 'email'|'name'|'token'>) => {
    await transport.sendMail({
      from: 'Taskflow <taskflow@gmail.com>',
      to: user.email,
      subject: 'Taskflow account confirmation',
      text: `Please ${user.name} enter the confirmation code below to verify your account`,
      html: `<div>
                <p>Confirmation code: <b>${user.token}</b></p>
                <a href="${process.env.FRONTEND_URL}/auth/account-confirmation">Confirm account</a>
              </div>`
    })
  }

  static sendResetPasswordInstructions = async (user: Pick<IMailingService, 'email'|'name'|'token'>) => {
    await transport.sendMail({
      from: 'Taskflow <taskflow@gmail.com>',
      to: user.email,
      subject: 'Taskflow reset password instructions',
      text: `Please ${user.name} enter the code below to reset your password`,
      html: `<div>
                <p>Reset password code: <b>${user.token}</b></p>
                <a href="${process.env.FRONTEND_URL}/auth/reset-password">Reset password</a>
              </div>`
    })
  }
}

export default Mailing