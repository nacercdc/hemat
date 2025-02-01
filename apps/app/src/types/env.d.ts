type EnvironnementType = "development" | "preview" | "production";
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ENV: string;
    EXPO_PUBLIC_API_URL: string;
  }
}
