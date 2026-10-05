'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

// Core controller plus a public `summary` action that returns ONLY aggregate
// metrics (no personal data), used for the service-satisfaction panel on the
// public Analytics page. Individual feedback stays private to the CMS.
module.exports = createCoreController('api::feedback.feedback', ({ strapi }) => ({
  async summary(ctx) {
    try {
      const entries = await strapi.documents('api::feedback.feedback').findMany({
        fields: ['rating', 'feedbackType', 'handled', 'serviceArea'],
        pagination: { limit: -1 },
      });
      const total = entries.length;
      const rated = entries.filter((e) => typeof e.rating === 'number' && e.rating > 0);
      const average = rated.length
        ? Math.round((rated.reduce((a, e) => a + e.rating, 0) / rated.length) * 10) / 10
        : null;
      const byType = {};
      for (const e of entries) {
        const k = e.feedbackType || 'Other';
        byType[k] = (byType[k] || 0) + 1;
      }
      const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const e of rated) byRating[e.rating] = (byRating[e.rating] || 0) + 1;
      const handled = entries.filter((e) => e.handled).length;
      ctx.body = { total, average, ratedCount: rated.length, handled, byType, byRating };
    } catch (e) {
      strapi.log.warn('[feedback] summary failed: ' + e.message);
      ctx.body = { total: 0, average: null, ratedCount: 0, handled: 0, byType: {}, byRating: {} };
    }
  },
}));
