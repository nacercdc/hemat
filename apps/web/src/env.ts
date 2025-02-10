import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "preview"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {},

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string({
      message: "Firebase API key in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string({
      message: "Firebase auth domain in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: z.string({
      message:
        "Firebase database url in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string({
      message: "Firebase project id in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string({
      message:
        "Firebase storage bucket in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID: z.string({
      message:
        "Firebase message sender ID in the environment variables is required.",
    }),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string({
      message: "Firebase app ID in the environment variables is required.",
    }),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
