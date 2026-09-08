'use strict';

const seedData = require('./seed-data');
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
