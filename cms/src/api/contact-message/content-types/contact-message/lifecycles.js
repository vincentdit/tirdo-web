'use strict';

// When a contact message is submitted, email a notification to TIRDO staff.
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const to = process.env.CONTACT_RECIPIENT || 'info@tirdo.or.tz';
    try {
      await strapi.plugin('email').service('email').send({
        to,
        replyTo: result.email,
        subject: `Website contact: ${result.subject || '(no subject)'}`,
        text:
          `A new message was submitted through the TIRDO website contact form.\n\n` +
          `Name:    ${result.name}\n` +
          `Email:   ${result.email}\n` +
          `Subject: ${result.subject || '(none)'}\n\n` +
          `${result.message}\n`,
        html:
          `<h3>New website contact message</h3>` +
          `<p><strong>Name:</strong> ${result.name}<br>` +
          `<strong>Email:</strong> ${result.email}<br>` +
          `<strong>Subject:</strong> ${result.subject || '(none)'}</p>` +
          `<p style="white-space:pre-wrap">${result.message}</p>`,
      });
      strapi.log.info('[contact] notification email sent to ' + to);
    } catch (e) {
      strapi.log.warn('[contact] email send failed: ' + e.message);
    }
  },
};
