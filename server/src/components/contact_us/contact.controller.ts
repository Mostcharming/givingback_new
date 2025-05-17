import { NextFunction, Request, Response } from "express";
import { ContactFormData } from "../../interfaces";
import Email from "../../utils/mail";

export const sendContactEmail = async (
  req: Request<{}, {}, ContactFormData>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, subject, message, phoneNumber } = req.body;

  try {
    await new Email({
      email: "info@givingbackng.org",
      url: "",
      token: 0,
      additionalData: {
        name,
        email,
        message,
        phoneNumber,
      },
    }).sendEmail("contactForm", subject);

    res.status(200).json({
      status: "success",
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      error: "There was an error sending your message. Please try again later.",
    });
  }
};
