'use strict';

// Prefer the generated real-content seed (produced by cms/scripts/gen-seed.mjs
// from frontend/src/lib/content.ts); fall back to the bundled demo seed when it
// hasn't been generated yet.
let seedData;
try {
  seedData = require('./seed-data.generated.json');
} catch {
  seedData = require('./seed-data');
}
const { auditMiddleware } = require('./audit');

module.exports = {
  register({ strapi }) {
    // Record every create/update/delete/publish on audited content types to
    // the tamper-evident audit log.
    strapi.documents.use(auditMiddleware(strapi));
  },

  async bootstrap({ strapi }) {
    // 1) Open up the public REST API for read access + contact submissions.
    await setPublicPermissions(strapi);

    // 2) Ensure the Kiswahili locale exists (English is the default).
    await ensureLocale(strapi, 'sw', 'Kiswahili (sw)');

    // 2b) Pre-populate the Customer Service Charter single type (EN + SW) if empty.
    await seedCharter(strapi);

    // 3) Seed demo content on an empty database (idempotent).
    if (process.env.SEED_DATA === 'true') {
      await seed(strapi);
    }

    // 3) Best-effort: push everything to OpenSearch so search works immediately.
    try {
      const { reindexAll } = require('./opensearch');
      await reindexAll(strapi);
    } catch (e) {
      strapi.log.warn('[opensearch] initial reindex skipped: ' + e.message);
    }
  },
};

async function ensureLocale(strapi, code, name) {
  try {
    const locales = strapi.plugin('i18n').service('locales');
    const existing = await locales.findByCode(code);
    if (!existing) {
      await locales.create({ code, name });
      strapi.log.info(`[i18n] created locale ${code}`);
    }
  } catch (e) {
    strapi.log.warn(`[i18n] could not ensure locale ${code}: ${e.message}`);
  }
}

async function setPublicPermissions(strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const readTypes = ['article', 'project', 'publication', 'department', 'service', 'page', 'vacancy', 'tender', 'technology'];
  const perms = {};
  for (const t of readTypes) {
    perms[`api::${t}.${t}`] = { controllers: { [t]: { find: { enabled: true }, findOne: { enabled: true } } } };
  }
  perms['api::contact-message.contact-message'] = {
    controllers: { 'contact-message': { create: { enabled: true } } },
  };
  perms['api::feedback.feedback'] = {
    controllers: { feedback: { create: { enabled: true } } },
  };
  perms['api::service-charter.service-charter'] = {
    controllers: { 'service-charter': { find: { enabled: true } } },
  };

  // Grant each action to the public role if not already present.
  for (const [uid, cfg] of Object.entries(perms)) {
    const actions = cfg.controllers[uid.split('.').pop()];
    for (const action of Object.keys(actions)) {
      const actionId = `${uid}.${action}`;
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: actionId, role: publicRole.id } });
      if (!existing) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionId, role: publicRole.id },
        });
      }
    }
  }
  strapi.log.info('[bootstrap] public API permissions ensured');
}

// Pre-populate the Customer Service Charter single type with EN + SW content on
// first boot, so management opens a filled-in form instead of a blank one.
// Idempotent: skips if the single type already has content.
async function seedCharter(strapi) {
  const uid = 'api::service-charter.service-charter';
  try {
    const charter = require('./charter-seed');
    const existing = await strapi.documents(uid).findMany({ locale: 'en' });
    if (Array.isArray(existing) && existing.length > 0) return;
    const created = await strapi.documents(uid).create({ data: charter.en, status: 'published' });
    if (created && created.documentId) {
      await strapi.documents(uid).update({ documentId: created.documentId, locale: 'sw', data: charter.sw, status: 'published' });
    }
    strapi.log.info('[seed] Customer Service Charter populated (en + sw)');
  } catch (e) {
    strapi.log.warn('[seed] charter seed skipped: ' + e.message);
  }
}

async function seed(strapi) {
  for (const [uid, entries] of Object.entries(seedData)) {
    const count = await strapi.documents(uid).count();
    if (count > 0) continue;
    for (const data of entries) {
      await strapi.documents(uid).create({ data, status: 'published' });
    }
    strapi.log.info(`[seed] created ${entries.length} ${uid}`);
  }
}
