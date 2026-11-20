import { ItemsStore } from './items.store.js';

describe('ItemsStore', () => {
  let store: ItemsStore;
  beforeEach(() => (store = new ItemsStore()));

  it('creates items with incrementing ids and defaults', () => {
    expect(store.create({ name: 'A', price: 1 })).toEqual({
      id: 1,
      name: 'A',
      description: null,
      price: 1,
      in_stock: true,
    });
    expect(store.create({ name: 'B', price: 2 }).id).toBe(2);
  });

  it('partially updates without wiping other fields', () => {
    store.create({ name: 'A', price: 1, description: 'keep me' });
    expect(store.update(1, { price: 5 })).toMatchObject({
      name: 'A',
      price: 5,
      description: 'keep me',
    });
  });

  it('returns undefined / false for missing items', () => {
    expect(store.get(1)).toBeUndefined();
    expect(store.update(1, { price: 1 })).toBeUndefined();
    expect(store.delete(1)).toBe(false);
  });
});
