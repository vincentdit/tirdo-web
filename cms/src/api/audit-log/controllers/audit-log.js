'use strict';

const { verifyChain } = require('../../../audit');

// Custom controller — no CRUD (the audit log is written internally and read via
// the admin panel). Exposes only a chain-integrity check, optionally protected
// by AUDIT_LOG_TOKEN (x-audit-token header or ?token=).
module.exports = {
  async verify(ctx) {
    const required = process.env.AUDIT_LOG_TOKEN;
    if (required) {
      const provided = ctx.request.header['x-audit-token'] || ctx.query.token;
      if (provided !== required) return ctx.unauthorized('invalid audit token');
    }
    ctx.body = await verifyChain(strapi);
  },
};
