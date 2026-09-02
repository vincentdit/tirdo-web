'use strict';
// Rebuild the OpenSearch index from current CMS content.
// Usage (inside the cms container):  npm run reindex
const { createStrapi, compileStrapi } = require('@strapi/strapi');

(async () => {
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const { reindexAll } = require('../src/opensearch');
    await reindexAll(app);
    app.log.info('[reindex] done');
  } catch (e) {
    app.log.error('[reindex] failed: ' + e.message);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
})();
