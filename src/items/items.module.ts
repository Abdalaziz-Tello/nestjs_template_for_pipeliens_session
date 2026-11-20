import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller.js';
import { ItemsStore } from './items.store.js';

@Module({
  controllers: [ItemsController],
  providers: [ItemsStore],
})
export class ItemsModule {}
