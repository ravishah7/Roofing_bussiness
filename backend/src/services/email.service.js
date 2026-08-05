import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transporter

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE, // true for 465, false for 587
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  })

  return transporter
}

async function sendMail({ to, subject, html, text, replyTo }) {
  const mailer = getTransporter()
  return mailer.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
    replyTo,
  })
}

function layout(title, bodyHtml) {
  return `
  <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background:#f5f5f4; padding:32px 0;">
    <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #eceeef;">
      <div style="background:#16181d; padding:24px 32px;">
        <span style="color:#FF6B00; font-weight:700; font-size:20px;">${env.SMTP_FROM_NAME}</span>
      </div>
      <div style="padding:32px;">
        <h2 style="margin:0 0 16px; color:#16181d; font-size:20px;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px; background:#FAFAF9; font-size:12px; color:#7a8291;">
        © ${new Date().getFullYear()} ${env.SMTP_FROM_NAME}. All rights reserved.
      </div>
    </div>
  </div>`
}

export const EmailService = {
  async sendVerificationEmail(admin, rawToken) {
    const link = `${env.ADMIN_URL}/verify-email?token=${rawToken}`
    await sendMail({
      to: admin.email,
      subject: 'Verify your admin account',
      html: layout(
        'Confirm your email address',
        `<p style="color:#4B5361; line-height:1.6;">Hi ${admin.name}, please confirm your email to activate your admin account.</p>
         <a href="${link}" style="display:inline-block; margin-top:16px; background:#FF6B00; color:#fff; text-decoration:none; padding:12px 24px; border-radius:999px; font-weight:600;">Verify Email</a>
         <p style="margin-top:20px; color:#7a8291; font-size:13px;">This link expires in 24 hours. If you didn't request this, you can ignore this email.</p>`
      ),
    })
  },

  async sendPasswordResetEmail(admin, rawToken) {
    const link = `${env.ADMIN_URL}/reset-password?token=${rawToken}`
    await sendMail({
      to: admin.email,
      subject: 'Reset your password',
      html: layout(
        'Reset your password',
        `<p style="color:#4B5361; line-height:1.6;">We received a request to reset the password for your admin account.</p>
         <a href="${link}" style="display:inline-block; margin-top:16px; background:#FF6B00; color:#fff; text-decoration:none; padding:12px 24px; border-radius:999px; font-weight:600;">Reset Password</a>
         <p style="margin-top:20px; color:#7a8291; font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`
      ),
    })
  },

  async sendContactNotification(contact) {
    await sendMail({
      to: env.CONTACT_NOTIFY_EMAIL,
      subject: `New contact form submission from ${contact.name}`,
      replyTo: contact.email,
      html: layout(
        'New Contact Form Submission',
        `<table style="width:100%; border-collapse:collapse; font-size:14px; color:#16181d;">
           <tr><td style="padding:6px 0; color:#7a8291;">Name</td><td>${contact.name}</td></tr>
           <tr><td style="padding:6px 0; color:#7a8291;">Email</td><td>${contact.email}</td></tr>
           <tr><td style="padding:6px 0; color:#7a8291;">Phone</td><td>${contact.phone || '—'}</td></tr>
           <tr><td style="padding:6px 0; color:#7a8291;">Service</td><td>${contact.service || '—'}</td></tr>
         </table>
         <p style="margin-top:16px; color:#4B5361; line-height:1.6; white-space:pre-wrap;">${contact.message || ''}</p>`
      ),
    })
  },

  async sendContactAutoReply(contact) {
    await sendMail({
      to: contact.email,
      subject: `We received your message, ${contact.name}`,
      html: layout(
        "Thanks for reaching out!",
        `<p style="color:#4B5361; line-height:1.6;">Hi ${contact.name}, thanks for contacting us. A member of our team will get back to you within one business day.</p>
         <p style="color:#4B5361; line-height:1.6;">If this is urgent, call our 24/7 emergency line any time.</p>`
      ),
    })
  },

  async sendNewsletterWelcome(email) {
    await sendMail({
      to: email,
      subject: 'You are subscribed 🎉',
      html: layout(
        'Welcome aboard',
        `<p style="color:#4B5361; line-height:1.6;">You're now subscribed to our newsletter for roofing tips, offers, and updates.</p>`
      ),
    })
  },
}

export default EmailService
