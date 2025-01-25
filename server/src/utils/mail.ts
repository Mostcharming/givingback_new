import { convert } from 'html-to-text'
import nodemailer from 'nodemailer'
import path from 'path'
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

  private getImageAttachments(): any[] {
    const images = ['image1.png', 'image2.png', 'image3.png']

    return images.map((image, index) => {
      const imagePath = path.join(__dirname, '..', 'views', 'images', image)
      return {
        filename: image,
        path: imagePath,
        cid: `image${index + 1}`, // Content ID for referencing in HTML
        contentDisposition: 'inline'
      }
    })
  }

  private async send(template: string, subject: string): Promise<void> {
    const { html, text } = this.generateEmailContent(template, subject)
    const attachments = this.getImageAttachments()

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
      attachments
    }

    await this.createTransport().sendMail(mailOptions)
  }

  async sendEmail(template: string, subject: string): Promise<void> {
    await this.send(template, subject)
  }
}

export default Email
