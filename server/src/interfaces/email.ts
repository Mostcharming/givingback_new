export interface EmailOptions {
  email: string
  url: string
  token: number
  additionalData?: { [key: string]: any }
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  phoneNumber: string
}
