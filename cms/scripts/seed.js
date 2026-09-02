'use strict';
// (Re)seed demo content. Only inserts into empty collections. Idempotent.
// Usage (inside the cms container):  npm run seed
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const seedData = require('../src/seed-data');

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const [uid, entries] of Object.entries(seedData)) {
      const count = await app.documents(uid).count();
      if (count > 0) {
        app.log.info(`[seed] ${uid} already has ${count} entries, skipping`);
        continue;
      }
      for (const data of entries) {
        await app.documents(uid).create({ data, status: 'published' });
      }
      app.log.info(`[seed] created ${entries.length} ${uid}`);
    }
  } catch (e) {
    app.log.error('[seed] failed: ' + e.message);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
