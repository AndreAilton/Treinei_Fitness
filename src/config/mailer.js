import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Ou smtp.gmail.com, etc.
  port: 2525,
  auth: {
    user: "613e3ecbb1233c", 
    pass: "abf937f2497846"
  }
});

export default transport;