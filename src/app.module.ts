import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import configuration from './config/configuration.js';
import { ItemsModule } from './items/items.module.js';

@Module({
  imports: [
    // Loads `.env` if it exists. Real environment variables (e.g. set on Render) win over `.env`.
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ItemsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
