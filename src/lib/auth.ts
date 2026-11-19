import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, type Db } from "mongodb";

function createAuthInstance(db: Db) {
  const googleConfigured =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);

  return betterAuth({
    database: mongodbAdapter(db),
    secret:
      process.env.BETTER_AUTH_SECRET ||
      "bharadei_dev_fallback_better_auth_secret_32chars",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    ...(googleConfigured
      ? {
          socialProviders: {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID as string,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            },
          },
        }
      : {}),
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "Customer",
          input: false,
        },
      },
    },
  });
}

let cachedAuth: ReturnType<typeof createAuthInstance> | null = null;
let cachedClient: MongoClient | null = null;

export async function getAuth() {
  if (cachedAuth) return cachedAuth;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured in frontend/.env.local");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri);
    await cachedClient.connect();
  }

  const db = cachedClient.db(process.env.DB_NAME || "bharadei");
  cachedAuth = createAuthInstance(db);
  return cachedAuth;
}
