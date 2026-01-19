import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, institution, lms, message } = req.body;

    // Validate required fields
    if (!name || !email || !institution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send notification email to you
    await resend.emails.send({
      from: 'Gridline Website <noreply@gridlineeducation.com>',
      to: 'lars@gridlineeducation.com',
      subject: `New Audit Request: ${institution}`,
      html: `
        <h2>New Audit Request from Gridline Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Institution:</strong> ${institution}</p>
        <p><strong>LMS Platform:</strong> ${lms || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This lead came from the Gridline Education website contact form.</p>
      `,
    });

    // Send confirmation email to the lead
    await resend.emails.send({
      from: 'Lars Janér <lars@gridlineeducation.com>',
      to: email,
      subject: 'Your Infrastructure Audit Request - Gridline Education',
      html: `
        <p>Hi ${name.split(' ')[0]},</p>
        <p>Thank you for your interest in Gridline Education. I've received your audit request for <strong>${institution}</strong> and will be in touch within 24 hours.</p>
        <p>In the meantime, if you're attending Bett London, come visit us at <strong>Stand SP40</strong> — I'd love to meet in person.</p>
        <p>Best regards,</p>
        <p><strong>Lars Janér</strong><br>
        Founder, Gridline Education<br>
        lars@gridlineeducation.com</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
