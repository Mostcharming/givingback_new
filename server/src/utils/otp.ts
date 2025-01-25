import otpGenerator from 'otp-generator'

// Function to generate OTP
export const generateOtp = (digit: number): number => {
  const otp = otpGenerator.generate(digit, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  })

  return parseInt(otp, 10)
}
