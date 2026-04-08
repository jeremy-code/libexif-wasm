/**
 * @borrows BiMap#deleteKey as BiMap#delete
 * @borrows BiMap#getValue as BiMap#get
 * @borrows BiMap#hasKey as BiMap#has
 *
 * @see {@link https://en.wikipedia.org/wiki/Bidirectional_map}
 */
class BiMap<K, V> extends Map<K, V> {
  readonly inverse: Map<V, K>;

  constructor(entries?: Iterable<readonly [K, V]> | null) {
    /**
     * Since running `super()` with entries will run the overriden `set` BEFORE
     * the inverse property has been initialized, an error would be thrown since
     * inverse would be undefined. Hence, `super` is ran with no parameters
     */
    super();
    this.inverse = new Map<V, K>();

    if (entries != null && entries !== undefined) {
      for (const entry of entries) {
        this.set(entry[0], entry[1]);
      }
    }
  }

  override clear(): void {
    super.clear();
    this.inverse.clear();
  }

  override delete(key: K): boolean {
    return this.deleteKey(key);
  }

  deleteKey(key: K): boolean {
    if (!this.has(key)) {
      return false;
    }

    const value = super.get(key)!;
    this.inverse.delete(value);

    return super.delete(key);
  }

  deleteValue(value: V): boolean {
    if (!this.hasValue(value)) {
      return false;
    }

    const key = this.getKey(value)!;
    this.inverse.delete(value);

    return super.delete(key);
  }

  getValue(key: K): V | undefined {
    return this.get(key);
  }

  getKey(value: V): K | undefined {
    return this.inverse.get(value);
  }

  hasKey(key: K): boolean {
    return this.has(key);
  }

  hasValue(value: V): boolean {
    return this.inverse.has(value);
  }

  override set(key: K, value: V): this {
    // If key already exists, remove old value mapping
    if (this.has(key)) {
      const oldValue = super.get(key)!;
      this.inverse.delete(oldValue);
    }

    // If value already exists, remove old key mapping
    if (this.hasValue(value)) {
      const oldKey = this.getKey(value)!;
      super.delete(oldKey);
    }

    super.set(key, value);
    this.inverse.set(value, key);

    return this;
  }
}

export { BiMap };
