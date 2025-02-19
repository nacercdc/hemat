type EnvironnementType = "development" | "preview" | "production";
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ENV: string;
    WEB_CLIENT_ID: string;
  }
}
