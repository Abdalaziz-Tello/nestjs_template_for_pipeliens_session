import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AppConfig } from './config/configuration.js';

@ApiTags('meta')
@Controller()
export class AppController {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  @Get()
  root() {
    return {
      message: this.config.get('welcomeMessage', { infer: true }),
      docs: '/docs',
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  /** Shows which config the running server picked up. Secrets are never returned, only whether they are set. */
  @Get('config')
  showConfig() {
    return {
      app_name: this.config.get('appName', { infer: true }),
      app_env: this.config.get('appEnv', { infer: true }),
      app_version: this.config.get('appVersion', { infer: true }),
      welcome_message: this.config.get('welcomeMessage', { infer: true }),
      api_secret_configured:
        this.config.get('apiSecret', { infer: true }) !== '',
    };
  }
}
