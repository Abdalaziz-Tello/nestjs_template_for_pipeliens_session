import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './config/configuration.js';

/** Shared by main.ts and the e2e tests so both run the app the same way. */
export function setupApp(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get(ConfigService<AppConfig, true>);
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(config.get('appName', { infer: true }))
      .setDescription(
        'A minimal NestJS backend with in-memory storage (no database).',
      )
      .setVersion(config.get('appVersion', { infer: true }))
      .build(),
  );
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'openapi.json',
  });
}
