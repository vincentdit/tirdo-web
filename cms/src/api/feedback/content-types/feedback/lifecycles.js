'use strict';

// When stakeholder feedback is submitted, email a notification to TIRDO staff.
// Best-effort: if email isn't configured this fails silently and the feedback
// is still stored (and visible in the CMS under Feedback).
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const to = process.env.FEEDBACK_RECIPIENT || process.env.CONTACT_RECIPIENT || 'info@tirdo.or.tz';
    const stars = result.rating ? `${'★'.repeat(result.rating)}${'☆'.repeat(5 - result.rating)} (${result.rating}/5)` : '(no rating)';
    try {
      await strapi.plugin('email').service('email').send({
        to,
        replyTo: result.email,
        subject: `Website feedback [${result.feedbackType || 'Feedback'}]: ${result.subject || result.serviceArea || 'Service feedback'}`,
        text:
          `New stakeholder feedback was submitted through the TIRDO website.\n\n` +
          `Type:         ${result.feedbackType || '(none)'}\n` +
          `Service area: ${result.serviceArea || '(none)'}\n` +
          `Rating:       ${stars}\n` +
          `Name:         ${result.name}\n` +
          `Email:        ${result.email}\n` +
          `Organization: ${result.organization || '(none)'}\n` +
          `Subject:      ${result.subject || '(none)'}\n\n` +
          `${result.message}\n`,
        html:
          `<h3>New website stakeholder feedback</h3>` +
          `<p><strong>Type:</strong> ${result.feedbackType || '(none)'}<br>` +
          `<strong>Service area:</strong> ${result.serviceArea || '(none)'}<br>` +
          `<strong>Rating:</strong> ${stars}<br>` +
          `<strong>Name:</strong> ${result.name}<br>` +
          `<strong>Email:</strong> ${result.email}<br>` +
          `<strong>Organization:</strong> ${result.organization || '(none)'}<br>` +
          `<strong>Subject:</strong> ${result.subject || '(none)'}</p>` +
          `<p style="white-space:pre-wrap">${result.message}</p>`,
      });
      strapi.log.info('[feedback] notification email sent to ' + to);
    } catch (e) {
      strapi.log.warn('[feedback] email send failed: ' + e.message);
    }
  },
};
