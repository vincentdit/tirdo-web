"use strict";

const { portalRedirectLocation } = require("../tirdo-portal-redirect");

module.exports = () => {
  return async (ctx, next) => {
    const location = portalRedirectLocation(ctx.method, ctx.path, ctx.get("accept"));
    if (location) {
      ctx.redirect(location);
      return;
    }
    await next();
  };
};
