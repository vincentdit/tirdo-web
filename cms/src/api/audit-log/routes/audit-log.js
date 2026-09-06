'use strict';

// Only a verification endpoint is exposed over the API. No find/create/update/
// delete routes — audit entries are written internally and browsed in the admin
// panel, keeping the log off the public REST surface entirely.
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/audit-log/verify',
      handler: 'audit-log.verify',
      config: { auth: false },
    },
  ],
};
