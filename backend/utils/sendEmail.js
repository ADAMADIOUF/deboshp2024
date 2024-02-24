import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // Email options
  let mailOptions = {
    from: 'adamadiouf2017@gmail.com', // Sender address
    to: options.email, // List of receivers
    subject: options.subject, // Subject line
    text: options.message, // Plain text body
  }

  // Send email
  await transporter.sendMail(mailOptions)
}

export default sendEmail
