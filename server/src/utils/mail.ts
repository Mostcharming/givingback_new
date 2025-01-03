import { convert } from 'html-to-text'
import nodemailer from 'nodemailer'
import pug from 'pug'
import { EmailOptions } from '../interfaces'

class Email {
  private to: string
  private url: string
  private token: number
  private from: string
  private additionalData: { [key: string]: any }

  constructor({ email, url, token, additionalData }: EmailOptions) {
    this.to = email
    this.url = url
    this.token = token
    this.additionalData = additionalData || {}
    this.from = `GivingBack<${process.env.EMAIL_FROM}>`
  }

  // Create transport for sending emails
  private newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  // Generic method to send email
  private async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      url: this.url,
      token: this.token,
      email: this.to,
      subject,
      ...this.additionalData
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    }

    await this.newTransport().sendMail(mailOptions)
  }

  // Method to send a welcome email to a user
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the GivingBack Family!')
  }

  // Method to send a welcome email to a donor
  async sendWelcomeD() {
    await this.send('donor', 'Welcome to the GivingBack Family!')
  }

  // Method to send a welcome email to a new NGO
  async sendWelcomeNGO() {
    await this.send('newU', 'Welcome to the GivingBack Family!')
  }

  // Method to send a password reset email
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token')
  }
  async conatctUs(subject: string) {
    await this.send('contactForm', subject)
  }
}

export default Email
