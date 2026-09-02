'use strict';
// Clears the seeded content collections and re-inserts from seed-data.js.
// Use after updating seed-data.js:  docker compose exec cms npm run reseed
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const seedData = require('../src/seed-data');

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const [uid, entries] of Object.entries(seedData)) {
      const existing = await app.documents(uid).findMany({ fields: ['documentId'], status: 'published' });
      const drafts = await app.documents(uid).findMany({ fields: ['documentId'], status: 'draft' });
      const all = [...existing, ...drafts];
      for (const e of all) {
        await app.documents(uid).delete({ documentId: e.documentId });
      }
      for (const data of entries) {
        await app.documents(uid).create({ data, status: 'published' });
      }
      app.log.info(`[reseed] ${uid}: removed ${all.length}, created ${entries.length}`);
    }
    // rebuild the search index to match
    try {
      const { reindexAll } = require('../src/opensearch');
      await reindexAll(app);
    } catch (e) {
      app.log.warn('[reseed] reindex skipped: ' + e.message);
    }
  } catch (e) {
    app.log.error('[reseed] failed: ' + e.message);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
