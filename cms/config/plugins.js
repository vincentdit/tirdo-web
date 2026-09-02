module.exports = ({ env }) => {
  const config = {
    // Users & Permissions (JWT for the public API / e-Services)
    "users-permissions": {
      config: {
        jwtSecret: env("JWT_SECRET"),
      },
    },

    // Email via SMTP (Mailpit locally; real SMTP in production)
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: env("SMTP_HOST", "mailpit"),
          port: env.int("SMTP_PORT", 1025),
          auth: env("SMTP_USERNAME")
            ? { user: env("SMTP_USERNAME"), pass: env("SMTP_PASSWORD") }
            : undefined,
          ignoreTLS: true,
        },
        settings: {
          defaultFrom: env("EMAIL_FROM", "no-reply@tirdo.or.tz"),
          defaultReplyTo: env("EMAIL_REPLY_TO", "info@tirdo.or.tz"),
        },
      },
    },
  };

  // File storage on MinIO (S3-compatible). Only registered when a MinIO
  // endpoint is configured; otherwise Strapi uses its local disk provider.
  if (env("MINIO_ENDPOINT")) {
    config.upload = {
      config: {
        provider: "aws-s3",
        providerOptions: {
          baseUrl: env("MINIO_PUBLIC_URL"),
          rootPath: "",
          s3Options: {
            endpoint: `http://${env("MINIO_ENDPOINT")}:${env("MINIO_PORT", "9000")}`,
            forcePathStyle: true, // required for MinIO
            region: env("MINIO_REGION", "us-east-1"),
            credentials: {
              accessKeyId: env("MINIO_ACCESS_KEY"),
              secretAccessKey: env("MINIO_SECRET_KEY"),
            },
            params: {
              Bucket: env("MINIO_BUCKET", "tirdo-media"),
            },
          },
        },
        actionOptions: { upload: {}, uploadStream: {}, delete: {} },
      },
    };
  }

  return config;
};
