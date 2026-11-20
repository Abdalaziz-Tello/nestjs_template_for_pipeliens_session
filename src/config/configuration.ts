/**
 * All configuration comes from environment variables.
 *
 * - Locally they are read from the `.env` file (copy `.env.example` -> `.env`).
 * - On Render you set them in the dashboard: Service -> Environment.
 *
 * Never commit your real `.env` file. Only `.env.example` belongs in git.
 */
export interface AppConfig {
  port: number;
  appName: string;
  appEnv: string;
  appVersion: string;
  welcomeMessage: string;
  apiSecret: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  appName: process.env.APP_NAME ?? 'NestJS Template',
  appEnv: process.env.APP_ENV ?? 'development',
  appVersion: process.env.APP_VERSION ?? '0.1.0',
  welcomeMessage: process.env.WELCOME_MESSAGE ?? 'Hello from NestJS!',
  apiSecret: process.env.API_SECRET ?? '',
});
