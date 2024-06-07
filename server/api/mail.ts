import nodemailer from 'nodemailer';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Konfigurieren Sie den SMTP-Transport
  const transporter = nodemailer.createTransport({
    host: config.MAILHOST, 
    port: config.MAILPORT,
    secure: false, // true für Port 465, false für andere Ports
    auth: {
        user: config.MAILUSER, 
        pass: config.MAILPASSWORD, 
    },
    tls: {
        rejectUnauthorized: false // Ignoriert Zertifikate
    },
  });

  const mailOptions = {
    from: 'office@secutimetec.de', 
    to: body.to, // Empfängeradresse aus dem Anfrage-Body
    subject: body.subject, // Betreff der E-Mail
    html: body.html, // Textinhalt der E-Mail
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
