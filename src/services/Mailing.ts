import transport from "../config/nodemailer"

interface IConfirmEmailUser {
  email: string
  name: string
  token: string
}

class Mailing {
  static sendConfirmationEmail = async (user: IConfirmEmailUser) => {
    await transport.sendMail({
      from: 'Taskflow <taskflow@gmail.com>',
      to: user.email,
      subject: 'Taskflow account confirmation',
      text: `Please ${user.name} enter the confirmation code below to verify your account`,
      html: `<p>Confirmation code: <b>${user.token}</b></p>`
    })
  }
}

export default Mailing