'use strict';

// The audit log is append-only: reject any attempt to modify or delete
// existing entries (including from the admin panel). New entries are inserted
// by the audit service via the query engine's create path, which is allowed.
function refuse() {
  throw new Error('Audit log is append-only: entries cannot be modified or deleted.');
}

module.exports = {
  beforeUpdate: refuse,
  beforeUpdateMany: refuse,
  beforeDelete: refuse,
  beforeDeleteMany: refuse,
};
