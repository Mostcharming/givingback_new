import { convert } from 'html-to-text'
import nodemailer from 'nodemailer'
import pug from 'pug'
import { EmailOptions } from '../interfaces'

class Email {
  private to: string
  private url: string
  private token: number
  private from: string
  private additionalData: Record<string, any>

  constructor({ email, url, token, additionalData }: EmailOptions) {
    this.to = email
    this.url = url
    this.token = token
    this.additionalData = additionalData || {}
    this.from = `GivingBack <${process.env.EMAIL_FROM}>`
  }

  // Create a transport instance for sending emails
  private createTransport() {
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env

    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
      throw new Error(
        'Email environment variables are not properly configured.'
      )
    }

    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: 2525,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
  }

  // Generate email HTML and text content
  private generateEmailContent(
    template: string,
    subject: string
  ): { html: string; text: string } {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      url: this.url,
      token: this.token,
      email: this.to,
      subject,
      ...this.additionalData
    })

    const text = convert(html)
    return { html, text }
  }

  // Generic method to send an email
  private async send(template: string, subject: string): Promise<void> {
    const { html, text } = this.generateEmailContent(template, subject)

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text
    }

    await this.createTransport().sendMail(mailOptions)
  }

  // Public method to send an email using a template
  async sendEmail(template: string, subject: string): Promise<void> {
    await this.send(template, subject)
  }
}

export default Email
