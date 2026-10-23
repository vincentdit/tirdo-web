'use strict';

const { verifyChain } = require('../../../audit');

// Custom controller — no CRUD (the audit log is written internally and read via
// the admin panel). Chain-integrity check requires AUDIT_LOG_TOKEN
// (x-audit-token header only; query tokens are rejected).
module.exports = {
  async verify(ctx) {
    const required = process.env.AUDIT_LOG_TOKEN;
    if (!required) return ctx.unauthorized('audit token is not configured');
    const provided = ctx.request.header['x-audit-token'];
    if (!provided || provided !== required) return ctx.unauthorized('invalid audit token');
    ctx.body = await verifyChain(strapi);
  },
};
