import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './config/configuration.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  const config = app.get(ConfigService<AppConfig, true>);
  const port = config.get('port', { infer: true });

  // Listen on 0.0.0.0 so the app is reachable inside containers / on Render.
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `${config.get('appName', { infer: true })} (${config.get('appEnv', { infer: true })}) listening on port ${port}`,
    'Bootstrap',
  );
}
await bootstrap();
