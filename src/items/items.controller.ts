import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateItemDto, Item, UpdateItemDto } from './item.dto.js';
import { ItemsStore } from './items.store.js';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly store: ItemsStore) {}

  @Get()
  @ApiOkResponse({ type: [Item] })
  list(): Item[] {
    return this.store.list();
  }

  @Get(':id')
  @ApiOkResponse({ type: Item })
  @ApiNotFoundResponse()
  get(@Param('id', ParseIntPipe) id: number): Item {
    return this.found(this.store.get(id));
  }

  @Post()
  @ApiCreatedResponse({ type: Item })
  create(@Body() data: CreateItemDto): Item {
    return this.store.create(data);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Item })
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateItemDto,
  ): Item {
    return this.found(this.store.update(id, data));
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number): void {
    if (!this.store.delete(id)) throw new NotFoundException('Item not found');
  }

  private found(item: Item | undefined): Item {
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
}
