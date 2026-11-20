import { Injectable } from '@nestjs/common';
import { CreateItemDto, Item, UpdateItemDto } from './item.dto.js';

/** Simple in-memory storage. Data is lost when the server restarts (or Render redeploys / sleeps). */
@Injectable()
export class ItemsStore {
  private items = new Map<number, Item>();
  private nextId = 1;

  list(): Item[] {
    return [...this.items.values()];
  }

  get(id: number): Item | undefined {
    return this.items.get(id);
  }

  create(data: CreateItemDto): Item {
    const item: Item = {
      id: this.nextId++,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      in_stock: data.in_stock ?? true,
    };
    this.items.set(item.id, item);
    return item;
  }

  update(id: number, data: UpdateItemDto): Item | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;
    const defined = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    const updated: Item = Object.assign({}, existing, defined);
    this.items.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }

  clear(): void {
    this.items.clear();
    this.nextId = 1;
  }
}
