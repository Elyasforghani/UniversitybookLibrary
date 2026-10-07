const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api",
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || "http://localhost:3000/api",
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "mock_public_key",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/mock",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "mock_private_key",
    },
    databaseUrl: process.env.DATABASE_URL!,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL || "",
      redisToken: process.env.UPSTASH_REDIS_TOKEN || "",
      qstashUrl: process.env.QSTASH_URL || "https://qstash.upstash.io/v2/publish",
      qstashToken: process.env.QSTASH_TOKEN || "",
    },
    resendToken: process.env.RESEND_TOKEN || "",
  },
};

export default config;
