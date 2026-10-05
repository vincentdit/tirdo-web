'use strict';
// Public aggregate-only endpoint (no auth, no personal data): GET /api/feedback-summary
module.exports = {
  routes: [
    { method: 'GET', path: '/feedback-summary', handler: 'feedback.summary', config: { auth: false } },
  ],
};
