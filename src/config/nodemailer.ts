import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { configDotenv } from 'dotenv'

configDotenv()

console.log(process.env)

const config : () => SMTPTransport.Options = () => ({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT!,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const transport = nodemailer.createTransport(config());

export default transport