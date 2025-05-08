export type AppConfig = {
  nodeEnv: string;
  name: string;
  version: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  throttlerTtl: number;
  throttlerLimit: number;
  throttlerBlockDuration?: number;
  adminEmail?: string;
  adminPassword?: string;
};
