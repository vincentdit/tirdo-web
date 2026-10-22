'use strict';

// After a CMS publish/update, tell the Next.js site to drop its cached
// Strapi pages so the public website shows the new content immediately.

const SITE_TYPES = new Set([
  'api::article.article',
  'api::project.project',
  'api::publication.publication',
  'api::service.service',
  'api::department.department',
  'api::page.page',
  'api::vacancy.vacancy',
  'api::tender.tender',
  'api::technology.technology',
  'api::service-charter.service-charter',
  'api::leader.leader',
  'api::site-brand.site-brand',
  'api::event.event',
  'api::partner.partner',
]);

const ACTIONS = new Set(['create', 'update', 'delete', 'publish', 'unpublish']);

async function pingFrontend(strapi) {
  const base = process.env.FRONTEND_INTERNAL_URL || 'http://frontend:3000';
  const token = process.env.SEARCH_ADMIN_TOKEN || '';
  const headers = { 'content-type': 'application/json' };
  if (token) headers['x-reindex-token'] = token;
  try {
    const res = await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers,
      body: '{}',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      strapi.log.warn(`[sync-site] frontend revalidate returned ${res.status}`);
      return;
    }
    strapi.log.info('[sync-site] website cache refreshed');
  } catch (e) {
    strapi.log.warn('[sync-site] frontend revalidate skipped: ' + e.message);
  }
}

function frontendSyncMiddleware(strapi) {
  return async (ctx, next) => {
    const result = await next();
    if (SITE_TYPES.has(ctx.uid) && ACTIONS.has(ctx.action)) {
      pingFrontend(strapi).catch(() => {});
    }
    return result;
  };
}

module.exports = { frontendSyncMiddleware, pingFrontend };
