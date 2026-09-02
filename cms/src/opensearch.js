'use strict';

const { Client } = require('@opensearch-project/opensearch');

const NODE = process.env.OPENSEARCH_NODE || 'http://opensearch:9200';
const INDEX = process.env.OPENSEARCH_INDEX || 'tirdo-content';

function client() {
  return new Client({ node: NODE, requestTimeout: 3000 });
}

// Map a Strapi entity to a flat search document.
function toDoc(uid, e) {
  const kind = uid.split('::')[1].split('.')[0];
  const typeLabel = { article: 'News', project: 'Project', publication: 'Publication', service: 'Service', department: 'Department', page: 'Page' }[kind] || 'Content';
  const urlBase = { article: '/news/', project: '/projects#', publication: '/publications', service: '/services/', department: '/departments/', page: '/' }[kind] || '/';
  return {
    id: `${kind}-${e.slug || e.id}`,
    type: typeLabel,
    title: e.title,
    excerpt: e.excerpt || e.summary || e.description || e.blurb || '',
    body: e.body || '',
    url: kind === 'publication' ? '/publications' : `${urlBase}${e.slug || ''}`,
  };
}

async function ensureIndex(os) {
  const exists = await os.indices.exists({ index: INDEX });
  if (!exists.body) {
    await os.indices.create({
      index: INDEX,
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            excerpt: { type: 'text' },
            body: { type: 'text' },
            type: { type: 'keyword' },
            url: { type: 'keyword' },
          },
        },
      },
    });
  }
}

async function reindexAll(strapi) {
  const os = client();
  await ensureIndex(os);

  const uids = [
    'api::article.article',
    'api::project.project',
    'api::publication.publication',
    'api::service.service',
    'api::department.department',
    'api::page.page',
  ];

  const body = [];
  for (const uid of uids) {
    const entries = await strapi.documents(uid).findMany({ status: 'published' });
    for (const e of entries) {
      const doc = toDoc(uid, e);
      body.push({ index: { _index: INDEX, _id: doc.id } });
      body.push(doc);
    }
  }
  if (body.length) {
    await os.bulk({ refresh: true, body });
    strapi.log.info(`[opensearch] indexed ${body.length / 2} documents`);
  }
}

// Index / remove a single entity (used by lifecycle hooks).
async function indexOne(uid, entity) {
  try {
    const os = client();
    await ensureIndex(os);
    const doc = toDoc(uid, entity);
    await os.index({ index: INDEX, id: doc.id, body: doc, refresh: true });
  } catch (_) {
    /* best effort */
  }
}

module.exports = { reindexAll, indexOne, client, INDEX };
