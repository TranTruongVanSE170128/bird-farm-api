import nodemailer from 'nodemailer'
import { Content } from 'mailgen'
import MailGen from 'mailgen'
import * as dotenv from 'dotenv'
dotenv.config()

const mailGenerator = new MailGen({
  theme: 'default',
  product: {
    name: 'MailGen',
    link: 'https://mailgen.js/'
  }
})

type TSendEmail = {
  userEmail: string
  mailContent: Content
  subject: string
}

const sendEmail = async ({ userEmail, mailContent, subject }: TSendEmail) => {
  const configTransport = {
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  }

  const transporter = nodemailer.createTransport(configTransport)

  const mail = mailGenerator.generate(mailContent)

  const message = {
    from: process.env.NODEMAILER_USER,
    to: userEmail,
    subject,
    html: mail
  }
  transporter.sendMail(message)
}
export { sendEmail }
