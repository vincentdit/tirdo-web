const path = require("path");

module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    postgres: {
      connection: {
        host: env("DATABASE_HOST", "postgres"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "tirdo_cms"),
        user: env("DATABASE_USERNAME", "tirdo"),
        password: env("DATABASE_PASSWORD", "tirdo"),
        ssl: env.bool("DATABASE_SSL", false),
      },
      pool: { min: env.int("DATABASE_POOL_MIN", 2), max: env.int("DATABASE_POOL_MAX", 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, "..", env("DATABASE_FILENAME", ".tmp/data.db")),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
