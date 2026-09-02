'use strict';
const { indexOne } = require('../../../../opensearch');
const UID = 'api::service.service';

module.exports = {
  async afterCreate(event) { await indexOne(UID, event.result); },
  async afterUpdate(event) { await indexOne(UID, event.result); },
};
